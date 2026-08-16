from django.shortcuts import render, get_object_or_404, redirect
from .models import Entry, Category
from .forms import EntryForm
from django.db.models import Q
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EntrySerializer, CategorySerializer
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank


def check_admin_key(request):
    return request.headers.get("X-Admin-Key") == settings.ADMIN_SECRET_KEY


@api_view(["GET"])
def api_home(request):
    entries = Entry.objects.all().order_by("-created_at")
    serializer = EntrySerializer(entries, many=True)
    return Response(serializer.data)


def home(request):
    entries = Entry.objects.all().order_by("-created_at")
    categories = Category.objects.all()
    return render(
        request, "trivia/home.html", {"entries": entries, "categories": categories}
    )


def category_entries(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    entries = category.entries.all()
    return render(
        request,
        "trivia/category_entries.html",
        {"category": category, "entries": entries},
    )


@api_view(["GET"])
def api_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def api_category_entries(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    entries = category.entries.all().order_by("-created_at")
    serializer = EntrySerializer(entries, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def api_entry_detail(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    serializer = EntrySerializer(entry)
    return Response(serializer.data)


def entry_detail(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    return render(request, "trivia/entry_detail.html", {"entry": entry})


def delete_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    if request.method == "POST":
        entry.delete()

        return redirect("/?deleted=1")
    return redirect("home")


@api_view(["DELETE"])
def api_delete_entry(request, entry_id):
    if not check_admin_key(request):
        return Response({"error": "Unauthorized"}, status=401)

    entry = get_object_or_404(Entry, id=entry_id)
    entry.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def api_add_entry(request):
    if not check_admin_key(request):
        return Response({"error": "Unauthorized"}, status=401)

    serializer = EntrySerializer(data=request.data)
    if serializer.is_valid():
        entry = serializer.save()
        return Response(EntrySerializer(entry).data, status=201)
    return Response(serializer.errors, status=400)


def add_entry(request):
    if request.method == "POST":
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save()
            names = form.cleaned_data["categories_text"].split(",")
            for raw_name in names:
                name = raw_name.strip()
                if not name:
                    continue
                category = Category.objects.filter(name__iexact=name).first()
                if not category:
                    category = Category.objects.create(name=name)
                entry.categories.add(category)
            return redirect("entry_detail", entry_id=entry.id)
    else:
        initial_name = request.GET.get("name", "")
        form = EntryForm(initial={"name": initial_name})
    return render(request, "trivia/add_entry.html", {"form": form})


def edit_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    if request.method == "POST":
        form = EntryForm(request.POST, instance=entry)
        if form.is_valid():
            entry = form.save()
            entry.categories.clear()
            for raw_name in form.cleaned_data["categories_text"].split(","):
                name = raw_name.strip()
                if name:
                    category, _ = Category.objects.get_or_create(name=name)
                    entry.categories.add(category)
            return redirect("entry_detail", entry_id=entry.id)
    else:
        existing_names = ", ".join(c.name for c in entry.categories.all())
        form = EntryForm(instance=entry, initial={"categories_text": existing_names})
    return render(request, "trivia/edit_entry.html", {"form": form, "entry": entry})


@api_view(["PUT"])
def api_edit_entry(request, entry_id):
    if not check_admin_key(request):
        return Response({"error": "Unauthorized"}, status=401)

    entry = get_object_or_404(Entry, id=entry_id)
    serializer = EntrySerializer(entry, data=request.data)
    if serializer.is_valid():
        entry = serializer.save()
        return Response(EntrySerializer(entry).data)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def api_search_results(request):
    query = request.GET.get("q", "").strip()
    entries = Entry.objects.none()

    if query:
        search_query = SearchQuery(query)
        entries = (
            Entry.objects.annotate(
                search=SearchVector("name", "content", "categories__name"),
                rank=SearchRank(
                    SearchVector("name", "content", "categories__name"), search_query
                ),
            )
            .filter(search=search_query)
            .order_by("-rank")
            .distinct()
        )

    serializer = EntrySerializer(entries, many=True)
    return Response(serializer.data)


def search_results(request):
    query = request.GET.get("q", "").strip()
    entries = Entry.objects.none()

    if query:
        search_query = SearchQuery(query)
        entries = (
            Entry.objects.annotate(
                search=SearchVector("name", "content", "categories__name"),
                rank=SearchRank(
                    SearchVector("name", "content", "categories__name"), search_query
                ),
            )
            .filter(search=search_query)
            .order_by("-rank")
            .distinct()
        )

    return render(
        request, "trivia/search_results.html", {"entries": entries, "query": query}
    )


@api_view(["POST"])
def api_generate_entry(request):
    if not check_admin_key(request):
        return Response({"error": "Unauthorized"}, status=401)

    title = request.data.get("title", "").strip()
    context = request.data.get("context", "").strip()
    categories_text = request.data.get("categories_text", "")

    if not title:
        return Response({"error": "Title is required."}, status=400)

    topic_description = f"'{title}' ({context})" if context else f"'{title}'"
    prompt = (
        f"Write 5-7 short factual bullet points about {topic_description} suitable for trivia study. "
        f"If the topic could refer to more than one distinct thing, choose the single most relevant "
        f"interpretation based on any context given, and write only about that. "
        f"Return only the bullet points, one per line, starting each with a dash. No introduction or conclusion."
    )

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            },
            json={
                "model": "openrouter/free",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
    except (requests.RequestException, KeyError, IndexError):
        return Response(
            {"error": "Something went wrong generating this entry. Please try again."},
            status=502,
        )

    entry = Entry.objects.create(name=title, content=content)
    for raw_name in categories_text.split(","):
        name = raw_name.strip()
        if name:
            category, _ = Category.objects.get_or_create(name=name)
            entry.categories.add(category)

    return Response(EntrySerializer(entry).data, status=201)


def generate_entry(request):
    if request.method == "POST":
        title = request.POST.get("title", "").strip()
        context = request.POST.get("context", "").strip()
        categories_text = request.POST.get("categories_text", "")
        if title:
            topic_description = f"'{title}' ({context})" if context else f"'{title}'"
            prompt = (
                f"Write 5-7 short factual bullet points about {topic_description} suitable for trivia study. "
                f"If the topic could refer to more than one distinct thing, choose the single most relevant "
                f"interpretation based on any context given, and write only about that. "
                f"Return only the bullet points, one per line, starting each with a dash. No introduction or conclusion."
            )
            try:
                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    },
                    json={
                        "model": "openrouter/free",
                        "messages": [{"role": "user", "content": prompt}],
                    },
                    timeout=30,
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
            except (requests.RequestException, KeyError, IndexError):
                return render(
                    request,
                    "trivia/generate_entry.html",
                    {
                        "error": "Something went wrong generating this entry. Please try again.",
                        "title": title,
                    },
                )

            entry = Entry.objects.create(name=title, content=content)
            for raw_name in categories_text.split(","):
                name = raw_name.strip()
                if name:
                    category, _ = Category.objects.get_or_create(name=name)
                    entry.categories.add(category)
            return redirect("entry_detail", entry_id=entry.id)

    initial_title = request.GET.get("name", "")
    return render(request, "trivia/generate_entry.html", {"title": initial_title})
