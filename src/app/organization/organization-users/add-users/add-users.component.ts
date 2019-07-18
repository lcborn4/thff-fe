import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { GetUserService } from '../../../services/user/get-user.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  orgUsers: any;
  users: any;
  usersToBeAdded: any;

  usersCount: any;

  selectedUsers: any;

  displayedColumns = ['username'];
  dataSourceAllUsers: any;//MatTableDataSource<OrganizationData>;
  dataSourceSelectedUsers: any;//MatTableDataSource<OrganizationData>;

  limit: number;
  skip: number;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('allUsersPaginator', { read: MatPaginator }) allUsersPaginator: MatPaginator;
  @ViewChild('selectedUsersPaginator', { read: MatPaginator }) selectedUsersPaginator: MatPaginator;

  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild('allUsersSort', { read: MatSort }) allUsersSort: MatSort;
  @ViewChild('selectedUsersSort', { read: MatSort }) selectedUsersSort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getUserService: GetUserService,
    public dialogRef: MatDialogRef<AddUsersComponent>
  ) {

    this.users = [];
    this.selectedUsers = [];

    this.limit = 5;//default to 5

  }

  ngOnInit() {

    console.log('window size', window.innerWidth)

    console.log('addusers: data', this.data)

    this.orgUsers = this.data.users;

    console.log('addusers: orgUsers', this.orgUsers)

    this.skip = 0;

    // this.getUsersCount();

    this.getUsers();

  }

  getUsers() {

    console.log('getting users')

    let userAlreadyIn = false;

    let paging = {
      limit: this.limit,
      skip: this.skip
    }

    console.log('paging', paging)

    this.getUserService.getUsersCount().subscribe((usersCount) => {
      this.usersCount = usersCount;
      console.log('this.usersCount', this.usersCount)

      this.allUsersPaginator.length = this.usersCount

      this.getUserService.getAllUsers(paging)
        .subscribe(
          (users) => {

            console.log('users', users);

            users.forEach(element => {

              userAlreadyIn = false;

              this.orgUsers.forEach(inside => {

                if (element.id == inside.id) {
                  userAlreadyIn = true;
                }

              });

              this.selectedUsers.forEach(inside => {

                if (element.id == inside.id) {
                  userAlreadyIn = true;
                }

              });

              this.users.forEach(inside => {

                if (element.id == inside.id) {
                  userAlreadyIn = true;
                }

              });


              if (!userAlreadyIn) {
                this.users.push(element)
              }

            });

            console.log('this.users - after', this.users);
            this.dataSourceAllUsers = new MatTableDataSource(this.users);

            // this.dataSourceAllUsers.paginator = this.allUsersPaginator;
            this.dataSourceAllUsers.sort = this.allUsersSort;

          })

    },
      (err) => {
        console.log(err)
      },
      () => {
      }

    )

  }

  getNextUsers() {

    console.log('getting users')

    this.users = [];

    let userAlreadyIn = false;

    let paging = {
      limit: this.limit,
      skip: this.skip
    }

    console.log('paging', paging)

    this.getUserService.getAllUsers(paging)
      .subscribe(
        (users) => {

          console.log('users', users);

          users.forEach(element => {

            userAlreadyIn = false;

            this.orgUsers.forEach(inside => {

              if (element.id == inside.id) {
                userAlreadyIn = true;
              }

            });

            this.selectedUsers.forEach(inside => {

              if (element.id == inside.id) {
                userAlreadyIn = true;
              }

            });

            this.users.forEach(inside => {

              if (element.id == inside.id) {
                userAlreadyIn = true;
              }

            });

            if (!userAlreadyIn) {
              this.users.push(element)
            }

          });

          console.log('this.users - after', this.users);
          this.dataSourceAllUsers = new MatTableDataSource(this.users);
          //reset the length
          this.allUsersPaginator.length = this.usersCount
          // this.dataSourceAllUsers.paginator = this.allUsersPaginator;
          this.dataSourceAllUsers.sort = this.allUsersSort;

        })

  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
    console.log('user id', row.id)

    console.log('all users', this.dataSourceAllUsers)


    this.dataSourceAllUsers.data.forEach((element, index) => {

      console.log('user', element)

      if (element.id == row.id) {
        console.log('we have user', index);

        this.dataSourceAllUsers.data.splice(index, 1);

        // console.log('we have user', this.dataSourceAllUsers.data);
        // this.dataSourceAllUsers = new MatTableDataSource(this.dataSourceAllUsers.data);

        this.dataSourceAllUsers.paginator = this.allUsersPaginator;
        this.dataSourceAllUsers.sort = this.allUsersSort;

        this.selectedUsers.push(element);
        console.log('added user - selectedUsers', this.selectedUsers)
        // this.dataSourceSelectedUsers.push(element)
        // this.dataSourceSelectedUsers = this.selectedUsers
        this.dataSourceSelectedUsers = new MatTableDataSource(this.selectedUsers);

        this.dataSourceSelectedUsers.paginator = this.selectedUsersPaginator;
        this.dataSourceSelectedUsers.sort = this.selectedUsersSort;

        console.log('this.dataSourceSelectedUsers', this.dataSourceSelectedUsers)

      }

    });

  }

  updateSize() {
    this.dialogRef.updateSize("1000px", "200px");
  }

  addUsers() {

    console.log('adding users')

    console.log('this.selectedUsers', this.selectedUsers)

    //close the dialog and return the selectedUsers
    this.dialogRef.close(this.selectedUsers);

  }

  cancel() {
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {

    console.log('applying filter');

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceAllUsers.filter = filterValue;
  }

  onPaginateChange(event) {
    console.log("Current page index: " + event.pageIndex);

    this.skip = event.pageIndex * 5;
    console.log('this.skip = ', this.skip)

    this.getNextUsers()

  }



}
