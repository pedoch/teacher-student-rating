import { AuthenticationService } from './../../../services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseApiService } from 'src/app/services/base-api.service';
import { SkeletonService } from 'src/app/services/skeleton.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  teachers: any = [];
  visible: boolean = false;
  selectedTeacher: any = [];
  departments: any = [];
  visibleAnimate: boolean = false;
  updateTeacherForm: FormGroup;
  validator_toast:any ={
    isSubmited: false,
    success:false,
    message: ''
  };
  images: any = [];
  message: any = '';
  submitLoader:boolean = false;
  user: any;
  constructor(private BaseApi: BaseApiService,
              private SkeletonService: SkeletonService,
              private formBuilder: FormBuilder,
              private router: Router,
              private auth: AuthenticationService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.BaseApi.getAllTeachers().pipe(catchError(err=>of(console.log(err)))).subscribe(data=>{
      this.teachers = data;
    });
    // .subscribe((success)=>{
    //   this.teachers = success;
    // },(error)=>{
    //   console.log(error);
    // });
    this.updateTeacherForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      gender: ['', Validators.required]
    });
    this.BaseApi.getAllDepartments().pipe(catchError(err=>of(console.log(err)))).subscribe(data=>{
      this.departments = data;
    })
    // .subscribe(success=>{
    //   this.departments = success;
    // }, error=>{
    //   console.log(error);
    // });
  }

  validator(){
    return this.updateTeacherForm.controls;
  }
  handleFileInput(event) {
    if(event.target.files.length){
      if(event.target.files[0].size > 4814501){
        this.message = `image size too large. image must be less than 5 mb`;
        return;
      }
      this.images = [];
      this.images.push(<File>event.target.files[0]);
    }
  }
  fetchPictures(image){
    return this.SkeletonService.getTeacherPictures(image);
  }
  onSubmitUpdateTeacher(){

  }
  editItem(data){
    this.selectedTeacher = data;
  }
  reviewAssessment(teacher){
    // return this.router.navigate([`authenticated/teacher/${teacher.profile.id}/assessment`], teacher);
    return this.router.navigate([`authenticated/teacher/my-performance/${teacher.profile.id}`], teacher);
  }
}
