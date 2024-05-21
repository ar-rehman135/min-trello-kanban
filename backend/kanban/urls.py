from django.contrib import admin
from django.urls import path
from api.views import CustomGraphQLView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", CustomGraphQLView.as_view(), name="graphql"),
]
