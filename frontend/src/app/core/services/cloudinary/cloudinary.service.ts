import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dqhw1xmyf'; // 👈 senin cloud name
  private uploadPreset = 'my_unsigned_preset'; // 👈 oluşturduğun preset adı

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, formData);
  }
}
