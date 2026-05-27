from django.shortcuts import render, redirect, get_object_or_404
from .models import Contact, Event, Media
import urllib.parse


def home(request):
    return render(request, 'home.html')


def about(request):
    return render(request, 'about.html')


def contact(request):

    if request.method == "POST":

        student_name = request.POST.get("student_name")
        father_name = request.POST.get("father_name")
        phone = request.POST.get("phone")
        student_class = request.POST.get("class")
        message = request.POST.get("message")

        text = f"""
New Student Enquiry

Student Name: {student_name}
Father Name: {father_name}

Phone: +91{phone}
Class: {student_class}

Message:
{message}
"""

        encoded_text = urllib.parse.quote(text)

        phone_number = "918374379176"
        whatsapp_url = f"https://wa.me/{phone_number}?text={encoded_text}"

        return redirect(whatsapp_url)

    return render(request, "contact.html")


# ===== EVENTS =====
def events(request):

    if request.method == 'POST':

        if not request.user.is_superuser:
            return redirect('events')

        title = request.POST.get('title')
        description = request.POST.get('description')

        event = Event.objects.create(
            title=title,
            description=description
        )

        files = request.FILES.getlist('media')

        for file in files:
            if file and hasattr(file, 'content_type'):
                if file.content_type.startswith('image'):
                    Media.objects.create(event=event, image=file)
                elif file.content_type.startswith('video'):
                    Media.objects.create(event=event, video=file)

        return redirect('events')

    events = Event.objects.all()
    return render(request, 'events.html', {'events': events})


# ===== EVENT DETAIL =====
def event_detail(request, id):
    event = get_object_or_404(Event, id=id)
    return render(request, 'event_detail.html', {'event': event})


# ===== DELETE EVENT =====
def delete_event(request, id):

    if not request.user.is_superuser:
        return redirect('events')

    event = get_object_or_404(Event, id=id)
    event.delete()
    return redirect('events')


# ===== DELETE MEDIA =====
def delete_media(request, id):

    if not request.user.is_superuser:
        return redirect('events')

    media = get_object_or_404(Media, id=id)
    event_id = media.event.id

    media.delete()

    return redirect('edit_event', id=event_id)


# ===== EDIT EVENT =====
def edit_event(request, id):

    if not request.user.is_superuser:
        return redirect('events')

    event = get_object_or_404(Event, id=id)

    if request.method == 'POST':
        event.title = request.POST.get('title')
        event.description = request.POST.get('description')
        event.save()

        files = request.FILES.getlist('media')

        for file in files:
            if file and hasattr(file, 'content_type'):
                if file.content_type.startswith('image'):
                    Media.objects.create(event=event, image=file)
                elif file.content_type.startswith('video'):
                    Media.objects.create(event=event, video=file)

        return redirect('events')

    return render(request, 'edit_event.html', {'event': event})