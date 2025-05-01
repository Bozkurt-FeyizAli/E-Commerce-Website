import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Complaint } from '@model/complaint';

@Component({
  selector: 'app-manage-complaints',
  standalone: false,
  templateUrl: './manage-complaints.component.html',
  styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  fetchComplaints() {
    this.adminService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch complaints', err);
        this.error = 'Failed to load complaints.';
        this.loading = false;
      }
    });
  }

  updateComplaint(complaint: Complaint) {
    const newStatus = prompt('Enter new status (e.g., In Progress, Resolved, Closed):', complaint.status);
    const resolutionComment = prompt('Enter resolution comment:', complaint.resolutionComment || '');
    if (newStatus) {
      this.adminService.updateComplaintStatus(complaint.id, newStatus, resolutionComment || '').subscribe({
        next: () => {
          if (['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(newStatus)) {
            complaint.status = newStatus as 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
          } else {
            console.error('Invalid status:', newStatus);
          }
          complaint.resolutionComment = resolutionComment || '';
        },
        error: (err) => {
          console.error('Failed to update complaint', err);
        }
      });
    }
  }
}
