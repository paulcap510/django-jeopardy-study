from django import forms
from .models import Entry

class EntryForm(forms.ModelForm):
    categories_text = forms.CharField(
        required=False,
        help_text="Comma-separated, e.g. Rivers, Geography"
        )

    class Meta:
        model = Entry
        fields = ['name', 'content']