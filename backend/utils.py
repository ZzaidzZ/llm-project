import inspect
from typing import Annotated, List
from fastapi import Form
import os

def as_form(cls):
    new_params = [
        inspect.Parameter(
            field_name,
            inspect.Parameter.POSITIONAL_ONLY,
            default=model_field.default,
            annotation=Annotated[model_field.annotation, *model_field.metadata, Form()],
        )
        for field_name, model_field in cls.model_fields.items()
    ]

    cls.__signature__ = cls.__signature__.replace(parameters=new_params)

    return cls

def get_uploads_directory():
    if "UPLOADS_DIRECTORY" in os.environ:
        return os.environ["UPLOADS_DIRECTORY"]
    raise ValueError("Missing UPLOADS_DIRECTORY Env Parameter")

def get_pinecone_api_key():
    if "PINECONE_API_KEY" in os.environ:
        return os.environ['PINECONE_API_KEY']
    raise ValueError("Missing Pinecone_API_Key Env Parameter")

def get_pinecone_index_name():
    if "PINECONE_INDEX_NAME" in os.environ:
        return os.environ["PINECONE_INDEX_NAME"]
    raise ValueError("Missing PINECONE_INDEX_NAME Env Parameter")

def batch_inputs(data: List, batch_size: int = 32):
    for i in range(0, len(data), batch_size):
        yield data[i:i+batch_size]

def setup_uploads_directory():
    uploads_directory = get_uploads_directory()
    os.makedirs(os.path.join(uploads_directory, "documents"), exist_ok=True)
    os.makedirs(os.path.join(uploads_directory, "images"), exist_ok=True)
    return uploads_directory