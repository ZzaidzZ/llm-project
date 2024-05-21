from typing import List, Dict
from pinecone import Pinecone, PodSpec, ServerlessSpec
from utils import get_pinecone_api_key, get_pinecone_index_name, batch_inputs


class PineconeVectorDB:
    def __init__(self):
        pinecone_api_key = get_pinecone_api_key()
        pinecone_index_name = get_pinecone_index_name()
        
        self.client = Pinecone(api_key=pinecone_api_key)
        if pinecone_index_name not in self.client.list_indexes().names():
            self.client.create_index(
                name=pinecone_index_name,
                dimension=512,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud='aws', 
                    region='us-east-1'
                ) 
            )
        self.index = self.client.Index(pinecone_index_name)
    
    def upsert_vectors(self, vectors: List[Dict]):
        for batch in batch_inputs(vectors):
            self.index.upsert(batch)