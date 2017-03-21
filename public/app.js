
class Gallery {
  constructor(userCount) {
    this.users = [];
    this.userCount = userCount;
    this.jsonUrl = 'https://jsonplaceholder.typicode.com';
    this.setUser = this.setUser.bind(this);
    for (let i = 0; i < userCount; i++) {
      this.loadUser(i+1);
    }
  }

  loadUser(userId) {
    $.ajax({
      url: this.jsonUrl + `/users/${userId}`,
      method: 'GET'
    }).then(data => {
      this.setUser(data)
      this.loadAlbumByUser(userId)
    });
  }

  loadAlbumByUser(userId) {
    $.ajax({
      url: this.jsonUrl + `/users/${userId}/albums`,
      method: 'GET'
    }).then(data => {this.users[userId-1].albums = data;})
  }

  setUser(data) {
    this.users.push(data);
  }


}


new Gallery(2);
