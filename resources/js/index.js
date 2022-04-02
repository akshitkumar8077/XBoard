const magazines = [
  "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
  "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
  "https://flipboard.com/@thehindu/sportstarlive-rj3ttinvz.rss",
  "https://flipboard.com/topic/musicindustry.rss",
  "https://flipboard.com/topic/artificialintelligence.rss",
  "https://flipboard.com/topic/learning.rss",
  "https://flipboard.com/topic/landscapephotography.rss",
  "https://flipboard.com/topic/elonmusk.rss",
  "https://flipboard.com/topic/softwareengineering.rss",
  "https://flipboard.com/topic/indianstartups.rss",
  "https://flipboard.com/topic/indiatravel.rss",
];

let url = "https://api.rss2json.com/v1/api.json?rss_url=";

async function fetchJson(url) {
  let resp = await fetch(url);
  resp = await resp.json();
  return resp;
}

function upDownFunc(count) {
  let collapse_button = document.querySelector(`#collapse-button-${count}`);

  let icon = document.querySelector(`#collapse-button-${count} .fas`);
  if (collapse_button.getAttribute("aria-expanded") == "false")
    icon.className = "fas fa-angle-up mr-2";
  else icon.className = "fas fa-angle-down mr-2";
  console.log("clicked");
}

function addArticlesToDOM(articles, title, count) {
  let data = document.querySelector("#data");

  let accordion_item = document.createElement("DIV");
  data.appendChild(accordion_item);
  accordion_item.className = "accordion-item border-0";

  accordion_item.innerHTML = `<h2 class="accordion-header topics" id='heading-${count}'>
    <button id='accordion-button-${count}' class="accordion-button shadow-none text-dark bg-white fs-5"  type="button" data-bs-toggle="collapse" data-bs-target='#collapse-${count}' aria-expanded="true" aria-controls="collapse-${count}">
      ${title}
    </button>
  </h2>`;

  let accordion_button = document.querySelector(`#accordion-button-${count}`);
  if (count > 1) {
    console.log(accordion_button);
    accordion_button.className += " collapsed";
    accordion_button.setAttribute("aria-expanded", "false");
  }

  let accordion_collapse = document.createElement("DIV");
  accordion_item.appendChild(accordion_collapse);
  accordion_collapse.className = "accordion-collapse collapse";
  if (count == 1) accordion_collapse.className = " show";
  accordion_collapse.setAttribute("id", `collapse-${count}`);
  accordion_collapse.setAttribute("aria-labelledby", `heading-${count}`);
  accordion_collapse.setAttribute("data-bs-parent", "#data");

  let row = document.createElement("DIV");
  accordion_collapse.appendChild(row);
  // data.appendChild(row);
  row.setAttribute("id", `topic-${count}`);
  row.className = "topics accordion-body";

  // let h3 = document.createElement('H3');
  // row.appendChild(h3);
  // h3.className="col-12 mt-2";
  // h3.innerHTML = title;

  row.innerHTML += `<div id='carouselExampleControls-${count}' class="carousel slide" data-bs-ride="carousel">
                       <div class="carousel-inner">
                       </div>
                       <button class="carousel-control-prev" type="button" data-bs-target='#carouselExampleControls-${count}' data-bs-slide="prev">
                          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Previous</span>
                       </button>
                       <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls-${count}" data-bs-slide="next">
                          <span class="carousel-control-next-icon" aria-hidden="true"></span>
                          <span class="visually-hidden">Next</span>
                       </button> 
                       </div>`;

  let carousel_inner = document.querySelector(
    `#topic-${count} .carousel-inner`
  );
  // console.log(carousel_inner);

  for (let article of articles) {
    let carousel_item = document.createElement("DIV");
    carousel_inner.appendChild(carousel_item);
    carousel_item.className = "carousel-item";

    if (article == articles[0]) carousel_item.className += " active";

    let card = document.createElement("A");
    carousel_item.appendChild(card);
    // card.className='card col-md-4';
    card.className = "card";
    card.setAttribute("href", article.link);
    card.setAttribute("target", "__blank");

    let img = document.createElement("IMG");
    card.appendChild(img);
    img.className = "card-img-top mt-4";
    img.setAttribute("src", article.enclosure.link);

    let card_body = document.createElement("DIV");
    card.appendChild(card_body);
    card_body.className = "card-body";

    let card_title = document.createElement("H3");
    card_body.appendChild(card_title);
    card_title.className = "card-title";
    // card_title.setAttribute('href',article.link);
    // card_title.setAttribute('target','__blank');
    card_title.innerHTML = article.title;

    let card_text = document.createElement("P");
    card_body.appendChild(card_text);
    card_text.className = "card-text my-2";

    let author = article.author;
    if (author.split(" ")[0] == "By") author = author.slice(3);
    let pubDate = article.pubDate;
    pubDate = pubDate.split(" ")[0];
    pubDate = `${pubDate.split("-")[2]}/${pubDate.split("-")[1]}/${pubDate
      .split("-")[0]
      .slice(2)}`;

    card_text.innerHTML = `<div class="text-secondary mb-2">${author}  <div class="d-inline mx-2">●</div>  ${pubDate}</div>
        <p>${article.description}</p>`;
  }
}

async function init() {
  let count = 1;
  for (let rss_link of magazines) {
    let json = await fetchJson(url + rss_link);
    let articles = json.items;
    addArticlesToDOM(articles, json.feed.title, count);
    count += 1;
  }
}

init();
