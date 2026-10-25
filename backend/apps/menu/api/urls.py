from django.urls import path

from menu.api.views import (
    FoodImageUploadView,
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
        "foods/upload-image/",
        FoodImageUploadView.as_view(),
        name="food-image-upload",
    ),
    path(
        "foods/",
        PublicFoodListView.as_view(),
        name="public-food-list",
    ),
]
