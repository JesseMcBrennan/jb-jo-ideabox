$('.card-section').on('click', '.delete-button', deleteCard);
$('.card-section').on('click', '.upvote', upVote);
$('.card-section').on('click', '.downvote', downVote);
$('.card-section').on('keyup', '.card-body', updateBody);
$('.card-section').on('keyup', '.title-display', updateTitle);
$('.save-button').on('click', newToDo);
$('.input-title').on('keyup', toggleButton);
$('.input-body').on('keyup', toggleButton);
$('.search').on('keyup', filterToDos);
$('.card-section').on('change', '.check-completed', toggleCompleted);
$('.show-completed').on('click', showCompleted)

function updateBody () {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.body = $('#' + id.toString() + ' .card-body').text();
  storeObject(toDoObject);
}

function toggleCompleted() {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.completed = !toDoObject.completed
  storeObject(toDoObject)
  $('#'+id.toString()).toggleClass('task-completed');
}

function showCompleted() { 
  for (var i = 0; i < localStorage.length; i++) {
    var returnCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(returnCard);
    if (parsedCard.completed) { 
      cardCreator(parsedCard); 
      $('#'+ parsedCard.id.toString()).prop("checked")
    }
  }
}

function updateTitle () {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.title = $('#' + id.toString() +' .title-display').text();
  storeObject(toDoObject);
}

function toggleButton () {  
  if ($('.input-title').val() === "" || $('.input-body').val() === "") {
    $('.save-button').prop("disabled", true);
  } else {
    $('.save-button').prop("disabled", false);
  }
}

function newToDo() {
  var toDoTitle = $('.input-title').val();
  var task = $('.input-body').val();
  var newestToDo = new CardInfo(toDoTitle, task);
  cardCreator(newestToDo);
  storeObject(newestToDo);
  clearInputFields();
};

function clearInputFields() {
    $('.input').val('');
    $('.save-button').prop("disabled", true);
};

function CardInfo (title, body) {
  this.title = title;
  this.body = body;
  this.priority = 'none';
  this.id = Date.now();
  this.completed = false;
};

function cardCreator(toDo) {
  $('.card-section').prepend(`<article id=${toDo.id} class="card">
                      <div class="delete-container"><input type="button" name="delete button" class="delete-button"></div>
                      <h2 class="title-display" contenteditable="true">${toDo.title}</h2>
                      <p class="card-body" contenteditable="true">${toDo.body}</p>
                      <input type="button" class="arrow-button upvote">
                      <input type="button" class="arrow-button downvote">
                      <h3 class="priority">
                        <span class="priority-text">priority: ${toDo.priority}</span>
                        <div><input id="check-completed" class="check-completed" type="checkbox"><label for="check-completed">completed</label><div>
                      </h3>
                    </article>`);
};

function storeObject(toDo) {
  localStorage.setItem(toDo.id, JSON.stringify(toDo));
}

function recreateCards() {
  for (var i = 0; i < localStorage.length; i++) {
    var returnCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(returnCard);
    console.log(parsedCard.completed)
    if (parsedCard.completed === false) { 
      cardCreator(parsedCard);
      } 
    } 
}

function deleteCard() {
  this.closest('article').remove();
  localStorage.removeItem(this.closest('article').id);
}

function upVote() {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id))
  if (toDoObject.priority === 'none') {
    toDoObject.priority = 'low';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: low');
  } else if (toDoObject.priority === 'low') {
    toDoObject.priority = 'normal';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: normal');
  } else if (toDoObject.priority === 'normal') {
    toDoObject.priority = 'high';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: high'); 
  } else if (toDoObject.priority === 'high') {
    toDoObject.priority = 'critical';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: critical');
  }
}

function downVote() {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id))
  if (toDoObject.priority === 'critical') {
    toDoObject.priority = 'high';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: high');
  } else if (toDoObject.priority === 'high') {
    toDoObject.priority = 'normal';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: normal');
  } else if (toDoObject.priority === 'normal') {
    toDoObject.priority = 'low';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: low');
  } else if (toDoObject.priority === 'low') {
    toDoObject.priority = 'none';
    storeObject(toDoObject);
    $('#'+id.toString()+' .priority-text').text('priority: none');
  }
};

function validateSearch() { 
  var searchTerms = $('.search').val();
  if (!searchTerms) { 
    recreateCards();
  } else {
      filterToDos()
  }
}

function filterToDos() { 
  $('.card-section').html('');
  var searchTerms = $('.search').val();
  for (var i = 0; i < localStorage.length; i++) { 
    var key = localStorage.key(i);
    var toDo = JSON.parse(localStorage.getItem(key));
    if (toDo.title.toLowerCase().includes(searchTerms.toLowerCase()) || 
      toDo.body.toLowerCase().includes(searchTerms.toLowerCase())) {
      cardCreator(toDo)
    }
  }
}
      
recreateCards();/**/
