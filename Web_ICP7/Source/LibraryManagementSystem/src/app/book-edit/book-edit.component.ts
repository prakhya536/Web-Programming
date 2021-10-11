import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ApiService, Book} from '../api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  id = this.route.snapshot.params['id'];

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.api.getBook(this.id)
      .subscribe(({_id, updated_date, __v, ...data}) => {
        console.log('obtained!', this, data);
        this.bookForm.setValue(data);
      });

    this.bookForm = this.formBuilder.group({
      'isbn': [null, Validators.required],
      'title': [null, Validators.required],
      'description': [null, Validators.required],
      'author': [null, Validators.required],
      'publisher': [null, Validators.required],
      'published_year': [null, Validators.required]
    });
  }

  onFormSubmit(book: Book) {
    this.api.updateBook(this.id, book)
      .subscribe(res => {
        const id = res['_id'];
        this.router.navigate(['/book-edit', id]);
      }, (err) => {
        console.log(err);
      });
  }
}
