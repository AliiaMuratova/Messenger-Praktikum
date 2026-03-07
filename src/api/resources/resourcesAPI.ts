import { HTTPTransport } from '../http/HttpTransport';
import { BASE_URL } from '../http/config';

interface Resource {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
}

class ResourcesAPI {
  private http = new HTTPTransport(BASE_URL);

  public async upload(file: File): Promise<Resource> {
    const formData = new FormData();
    formData.append('resource', file);

    return this.http.post<Resource>('resources', { data: formData });
  }
}

export const resourcesAPI = new ResourcesAPI();
