
from django.conf import settings
from imagekitio import ImageKit


def upload_food_image(file, file_name):
    private_key = settings.IMAGEKIT_PRIVATE_KEY

    if not private_key:
        raise RuntimeError("ImageKit private key is not configured.")

    imagekit = ImageKit(private_key=private_key)

    response = imagekit.files.upload(
        file=file,
        file_name=file_name,
        folder="/magmays-kitchen/foods",
        use_unique_file_name=True,
    )

    # ImageKit SDK responses may expose fields as attributes.
    url = getattr(response, "url", None)

    if not url:
        raise RuntimeError("ImageKit did not return an image URL.")

    return url
