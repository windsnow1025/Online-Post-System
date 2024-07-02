import axios, { AxiosInstance } from 'axios';
import { Post } from '@/src/model/Post';

export default class PostService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: process.env.NEXT_PUBLIC_NEST_API_BASE_URL });
  }

  async fetchPosts(): Promise<Post[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async fetchPost(id: number): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get(`/posts/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async createPost(title: string, content: string, url?: string): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.post("/posts/post", {
      title,
      content,
      url
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async updatePost(id: number, title: string, content: string, url?: string): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.put(`/posts/post`, {
      id,
      title,
      content,
      url
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async deletePost(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/posts/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}