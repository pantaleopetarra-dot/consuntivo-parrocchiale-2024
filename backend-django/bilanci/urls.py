from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'bilanci', views.BilancioViewSet, basename='bilancio')  # Aggiunto basename

urlpatterns = [
    path('', include(router.urls)),
]