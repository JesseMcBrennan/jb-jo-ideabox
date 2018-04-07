$ideaTitle = $('.input-title');
$ideaBody = $('.input-body');
$ideaSave = $('.save-button');
$ideaSearch = $('.search');
$anchor = $('.card-section');
recreateCards();

$ideaSave.on('click', newIdea);
$ideaTitle.on('keyup', toggleButton);
$ideaBody.on('keyup', toggleButton);
$('.search').on('keyup', filterIdeas);

function toggleButton () {
  $ideaTitle = $('.input-title');
  if ($ideaTitle.val() === "" && $ideaBody.val() === "") {
    $ideaSave.prop("disabled", true);
  } else {
    $ideaSave.prop("disabled", false);
  }
}

function newIdea() {
  var ideaTitle = $ideaTitle.val();
  var ideaBody = $ideaBody.val();
  var newestIdea = new CardInfo(ideaTitle, ideaBody);
  cardCreator(newestIdea);
  storeObject(newestIdea);
  clearInputFields();
};

function clearInputFields() {
    $('.input').val('');
};

function CardInfo (title, body) {
  this.title = title;
  this.body = body;
  this.quality = 'swill';
  this.id = Date.now();
};

function cardCreator(idea) {
  $anchor.prepend(`<article id=${idea.id} class="card">
                      <h2 class=".title-display">${idea.title}</h2>
                      <input type="button" name="delete button" class="delete-button">
                      <p class="card-body">${idea.body}</p>
                      <input type="button" class="arrow-button upvote">
                      <input type="button" class="arrow-button downvote">
                      <h3 class="quality">quality: 
                        <span class="quality-text">${idea.quality}</span>
                      </h3>
                    </article>`);
};

function storeObject(idea) {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function recreateCards() {
  for (var i = 0; i < localStorage.length; i++) {
    var returnCard = localStorage.getItem(localStorage.key(i));
    var parsedCard = JSON.parse(returnCard);
    cardCreator(parsedCard);
  }
}

$('.card-section').on('click', '.delete-button', deleteCard);
$('.card-section').on('click', '.upvote', upVote);
$('.card-section').on('click', '.downvote', downVote);



function deleteCard() {
  this.closest('article').remove();
  localStorage.removeItem(this.closest('article').id);
}

function upVote() {
  var id = this.closest('article').id
  var ideaObject = JSON.parse(localStorage.getItem(id))
  if (ideaObject.quality === 'swill') {
    ideaObject.quality = 'plausible';
    storeObject(ideaObject);
    $('#'+id.toString()+' .quality-text').text('plausible');
  } else if (ideaObject.quality === 'plausible') {
    ideaObject.quality = 'genius';
    storeObject(ideaObject);
    $('#'+id.toString()+' .quality-text').text('genius');
  }
};

function downVote() {
  var id = this.closest('article').id
  var ideaObject = JSON.parse(localStorage.getItem(id))
  if (ideaObject.quality === 'genius') {
    ideaObject.quality = 'plausible';
    storeObject(ideaObject);
    $('#'+id.toString()+' .quality-text').text('plausible');
  } else if (ideaObject.quality === 'plausible') {
    ideaObject.quality = 'swill';
    storeObject(ideaObject);
    $('#'+id.toString()+' .quality-text').text('swill');
  }
};

function validateSearch() { 
  var searchTerms = $('.search').val();
  if (!searchTerms) { 
    recreateCards();
  } else {
      filterIdeas()
  }
}

function filterIdeas() { 
  $('.card-section').html('');
  var searchTerms = $('.search').val();
  for (var i = 0; i < localStorage.length; i++) { 
    var key = localStorage.key(i);
    var idea = JSON.parse(localStorage.getItem(key));
    if (idea.title.toLowerCase().includes(searchTerms.toLowerCase()) || 
      idea.body.toLowerCase().includes(searchTerms.toLowerCase())) {
      cardCreator(idea)

    }
  }
}
      

