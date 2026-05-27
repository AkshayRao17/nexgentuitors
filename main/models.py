from django.db import models


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.title


class Media(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='media'
    )
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    video = models.FileField(upload_to='events/videos/', blank=True, null=True)

    def __str__(self):
        return f"Media for {self.event.title}"