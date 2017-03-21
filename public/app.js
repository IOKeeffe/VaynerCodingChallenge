
class Gallery {
  constructor(userCount) {
    this.users = [];
    this.loadedAlbumCount = 0;
    this.userCount = userCount;
    this.jsonUrl = 'https://jsonplaceholder.typicode.com';
    this.setUser = this.setUser.bind(this);
    this.sendOwnerChange = this.sendOwnerChange.bind(this);
    this.dropAlbum = this.dropAlbum.bind(this);
    this.dragAlbum = this.dragAlbum.bind(this);
    for (let i = 0; i < userCount; i++) {
      this.loadUser(i+1);
    }
  }

  buildAlbums() {
    this.users.forEach((user) => {
      let $userDiv = $(`<section class='user-div'> <h2>${user.name}</h2> </section>`);
      let $user = $(`<ul class='user-gallery' id=${'user-gallery-'+user.id}>
        </ul>`);
        $user.data('user', user)
        this.buildUserAlbums($user);
        $userDiv.append($user);
      $('#root').append($userDiv);
    });
    this.addDragListeners();
  }

  

  addDragListeners() {
    $('.album').on('dragstart', this.dragAlbum);
    $('.user-gallery').on('drop', this.dropAlbum);
    $('.user-gallery').on('dragover', this.allowDrop)
  }

  dragAlbum(ev) {
    this.dragging = ev.target;
  }


  allowDrop(ev) {
    ev.preventDefault();
  }

  dropAlbum(ev) {
    ev.preventDefault();
    this.sendOwnerChange(this.dragging, ev.currentTarget);
  }

  sendOwnerChange(oldAlbumElement, newGalleryElement) {
    let oldAlbum = $(oldAlbumElement).data('album')
    let newOwnerId = $(newGalleryElement).data('user').id
    oldAlbum.userId = newOwnerId
    $.ajax({
      method: 'PATCH',
      url: this.jsonUrl + `/albums/${oldAlbum.id}`,
      data: oldAlbum,
    }).then(data => {
      this.repositionAlbum(oldAlbumElement, newGalleryElement)
    });
  }

  repositionAlbum(oldAlbumElement, newGalleryElement) {
    $(oldAlbumElement).detach();
    newGalleryElement.append(oldAlbumElement);
  }

  buildUserAlbums($user) {
    let user = $user.data('user');
    user.albums.forEach((album) => {
      let $album = $(`<li class='album' id=${'album-' + album.id} draggable='true'>
          <h3 class='album-id'>${album.id}</h3>
          <h3 class='album-title'>${album.title}</h3>
        </li>`);
      $album.data("album", album);
      $user.append($album);
    });
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
    }).then(data => {
      this.users[userId-1].albums = data;
      this.loadedAlbumCount += 1
      if(this.loadedAlbumCount === this.userCount) {
        this.buildAlbums();
      }
    });
  }

  setUser(data) {
    this.users.push(data);
  }
}


new Gallery(2);
