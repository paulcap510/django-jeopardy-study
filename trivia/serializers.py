from rest_framework import serializers
from .models import Entry, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class EntrySerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    categories_text = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Entry
        fields = ['id', 'name', 'content', 'categories', 'categories_text', 'created_at']

    def create(self, validated_data):
        categories_text = validated_data.pop('categories_text', '')
        entry = Entry.objects.create(**validated_data)
        for raw_name in categories_text.split(','):
            name = raw_name.strip()
            if name:
                category, _ = Category.objects.get_or_create(name=name)
                entry.categories.add(category)
        return entry


    def update(self, instance, validated_data):
        categories_text = validated_data.pop('categories_text', None)
        instance.name = validated_data.get('name', instance.name)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        if categories_text is not None:
            instance.categories.clear()
            self._set_categories(instance, categories_text)
        return instance

    def _set_categories(self, entry, categories_text):
        for raw_name in categories_text.split(','):
            name = raw_name.strip()
            if name:
                category, _ = Category.objects.get_or_create(name=name)
                entry.categories.add(category)


