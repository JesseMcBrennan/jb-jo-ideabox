$('.card-section').on('click', '.delete-button', deleteCard);
$('.card-section').on('click', '.upvote', upVote);
$('.card-section').on('click', '.downvote', downVote);
$('.card-section').on('keyup', '.card-body', updateBody);
$('.card-section').on('keyup', '.title-display', updateTitle);
$('.save-button').on('click', newToDo);
$('.show-more').on('click', renderAll);
$('.input-title').on('keyup', toggleButton);
$('.input-body').on('keyup', toggleButton);
$('.search').on('keyup', filterToDos);
$('.card-section').on('change', '.check-completed', toggleCompleted);
$('.show-completed').on('click', showCompleted)
$('.sort-button').on('click', sortByQuality)

function toggleButton () {  
  if ($('.input-title').val() === "" || $('.input-body').val() === "") {
    $('.save-button').prop("disabled", true);
  } else {
    $('.save-button').prop("disabled", false);
  }
}

function renderCards(all) { 
  $('.card-section').html('');
  var renderNumber;
  if (localStorage.length > 10 && !all) {
    renderNumber = 10;
  } else {
    renderNumber = localStorage.length;
  }
  for (var i = localStorage.length - renderNumber; i < localStorage.length; i++) {
    var toDoObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (!toDoObject.completed) { 
      cardCreator(toDoObject);
    } 
  } 
}

function CardInfo (title, body) {
  this.title = title;
  this.body = body;
  this.priority = 'normal';
  this.id = Date.now();
  this.completed = false;
}

function cardCreator(toDo) {
  $('.card-section').prepend(`<article id=${toDo.id} class="card">
                      <div class="delete-container">
                      <input type="button" name="delete button" class="delete-button arrow-button"></div>
                      <h2 class="title-display editable" contenteditable="true">${toDo.title}</h2>
                      <p class="card-body editable" contenteditable="true">${toDo.body}</p>
                      <h3 class="priority">
                        <span class="voting">
                          <span class="arrows">
                            <input type="button" class="arrow-button upvote">
                            <input type="button" class="arrow-button downvote">
                          </span>
                          <span class="priority-text">priority: ${toDo.priority}</span>
                        </span>
                        <div>
                          <input id="check-completed" class="check-completed" type="checkbox">
                          <label for="check-completed">completed</label>
                        </div>
                      </h3>
                    </article>`);
}


function sortByQuality() {
  renderCards();
  if ($(event.target).hasClass('quality-none')) {
      $('article h3 .priority-text').not(':contains(none)').closest('article').hide();
  } else if ($(event.target).hasClass('quality-low')) {
      $('article h3 .priority-text').not(':contains(low)').closest('article').hide();
  } else if ($(event.target).hasClass('quality-normal')) {
      $('article h3 .priority-text').not(':contains(normal)').closest('article').hide();
  } else if ($(event.target).hasClass('quality-high')) {
      $('article h3 .priority-text').not(':contains(high)').closest('article').hide();
  } else if ($(event.target).hasClass('quality-critical')) {
      $('article h3 .priority-text').not(':contains(critical)').closest('article').hide();
  }
}

function validateSearch() { 
  var searchTerms = $('.search').val();
  if (!searchTerms) { 
    renderCards();
  } else {
      filterToDos()
  }
}

function filterToDos() { 
  $('.card-section').html('');
  var searchTerms = $('.search').val();
  for (var i = 0; i < localStorage.length; i++) { 
    var key = localStorage.key(i);
    var toDoObject = JSON.parse(localStorage.getItem(key));
    if (toDoObject.title.toLowerCase().includes(searchTerms.toLowerCase()) || 
      toDoObject.body.toLowerCase().includes(searchTerms.toLowerCase())) {
      cardCreator(toDoObject)
    }
  }
}

function updateBody () {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.body = $('#' + id.toString() + ' .card-body').text();
  storeObject(toDoObject);
  if (event.which == 13) {
    this.blur();
  }
}

function updateTitle () {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.title = $('#' + id.toString() +' .title-display').text();
  storeObject(toDoObject);
  if (event.which == 13) {
    this.blur();
  }
}

function toggleCompleted() {
  var id = this.closest('article').id
  var toDoObject = JSON.parse(localStorage.getItem(id));
  toDoObject.completed = !toDoObject.completed
  storeObject(toDoObject)
  $('#'+id.toString()).toggleClass('task-completed');
}

function showCompleted() { 
  $('.card-section').html('');
  renderCards();
  for (var i = 0; i < localStorage.length; i++) {
    var toDoObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
    if (toDoObject.completed) { 
      cardCreator(toDoObject); 
      $('#'+ toDoObject.id.toString() + ' .check-completed').prop('checked', true)
      $('#'+ toDoObject.id.toString()).addClass('task-completed');
    }
  }
}

function newToDo() {
  var toDoTitle = $('.input-title').val();
  var task = $('.input-body').val();
  var newestToDo = new CardInfo(toDoTitle, task);
  cardCreator(newestToDo);
  storeObject(newestToDo);
  clearInputFields();
}

function clearInputFields() {
    $('.input').val('');
    $('.save-button').prop("disabled", true);
}


function storeObject(toDo) {
  localStorage.setItem(toDo.id, JSON.stringify(toDo));
}

function renderAll () {
  renderCards(1);
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
}

 renderCards();
