export class User {
  firstName;

  lastName;

  name;

  initials;

  email;

  _id;

  constructor({
    firstName,
    lastName,
    email,
    _id,
  }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this._id = _id;
    this.name = `${firstName} ${lastName}`;
    this.initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }
}
