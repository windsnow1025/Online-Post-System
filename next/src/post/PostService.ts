import axios, { AxiosInstance } from 'axios';
import { Post, PostStatus, Comment } from '@/src/post/Post';

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

  async fetchPostById(id: number): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async fetchApprovedPosts(): Promise<Post[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get("/posts/approved", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async createPost(title: string, content: string, url?: string): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.post("/posts", {
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
    const res = await this.axiosInstance.put(`/posts`, {
      id,
      title,
      content,
      url
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async updateRead(id: number): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.put(`/posts/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async deletePost(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async fetchAllPosts(): Promise<Post[]> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.get(`/posts/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async updatePostReview(id: number, status: PostStatus, comment: string): Promise<Post> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.put(`/posts/admin/${id}/review`, {
      status, comment
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async likePost(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await this.axiosInstance.post(`/posts/${id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async commentOnPost(id: number, content: string): Promise<Comment> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.post(`/posts/${id}/comment`, {
      content
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async cancelLike(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/posts/${id}/like`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async reviseComment(postId: number, commentId: number, content: string): Promise<Comment> {
    const token = localStorage.getItem('token');
    const res = await this.axiosInstance.put(`/posts/${postId}/comment/${commentId}`, {
      content
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }

  async deleteComment(postId: number, commentId: number): Promise<void> {
    const token = localStorage.getItem('token');
    await this.axiosInstance.delete(`/posts/${postId}/comment/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}