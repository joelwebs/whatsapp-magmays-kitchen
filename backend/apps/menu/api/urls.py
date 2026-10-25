from django.urls import path

from menu.api.views import (
    PublicCategoryListView,
    PublicFoodListView,
)

urlpatterns = [
    path(
        "categories/",
        PublicCategoryListView.as_view(),
        name="public-category-list",
    ),
    path(
        "foods/",
        PublicFoodListView.as_view(),
        name="public-food-list",
    ),
]
