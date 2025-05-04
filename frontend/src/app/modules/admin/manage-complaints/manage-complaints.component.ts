import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService } from '../service/admin.service';
import { Complaint } from '@model/complaint';

@Component({
  selector: 'app-manage-complaints',
  standalone: false,
  templateUrl: './manage-complaints.component.html',
  styleUrls: ['./manage-complaints.component.css']
})
export class ManageComplaintsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'user', 'product', 'message', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<Complaint>();
  statusFilter = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchComplaints();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchComplaints() {
    this.adminService.getAllComplaints().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Failed to fetch complaints', err)
    });
  }

  applyFilter() {
    this.dataSource.filter = this.statusFilter;
  }

  viewDetails(complaint: Complaint) {
    // Implement view details logic
  }

  closeComplaint(complaintId: number) {
    this.adminService.updateComplaintStatus(complaintId, 'CLOSED', 'Resolved by admin')
      .subscribe({
        next: () => this.fetchComplaints(),
        error: (err) => console.error('Failed to close complaint', err)
      });
  }
}
