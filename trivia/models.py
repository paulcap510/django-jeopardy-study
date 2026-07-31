from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Entry(models.Model):
    name = models.CharField(max_length=255, unique=True)
    content = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, related_name='entries', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Entries"

    def __str__(self):
        return self.name