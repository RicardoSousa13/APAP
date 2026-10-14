const projects = [
  {
    number: "07",
    title: "Collage garden",
    location: "Estoril, PT",
    slides: [
      {
        src: "assets/images/img_test.png",
        alt: "Garden with a stone path, mature trees, planting beds, and a timber pergola.",
      },
    ],
  },
  // Temporary content to preview the scroll transition. Replace with a real project later.
  {
    number: "08",
    title: "Next — preview",
    location: "Location, PT",
    slides: [
      {
        src: "assets/images/img_test.png",
        alt: "Temporary preview using the existing garden image.",
      },
    ],
  },
];

const projectContainer = document.querySelector("#projects");
const indexList = document.querySelector("#index-list");

function createProject(project, projectPosition) {
  const panel = document.createElement("section");
  const projectId = `project-${project.number}`;
  panel.className = "project";
  if (projectPosition === 0) panel.classList.add("is-current");
  panel.id = projectId;
  panel.setAttribute("aria-label", `${project.title}, ${project.location}`);

  const caption = document.createElement("div");
  caption.className = "project-caption text-reveal";
  caption.style.setProperty("--reveal-delay", "180ms");

  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = `( ${project.number} )`;

  const details = document.createElement("div");
  const title = document.createElement("h1");
  title.className = "project-title";
  title.textContent = project.title;

  const location = document.createElement("span");
  location.className = "project-location";
  location.textContent = project.location;

  details.append(title, location);
  caption.append(number, details);

  const visual = document.createElement("div");
  visual.className = "project-visual element-reveal";
  visual.style.setProperty("--reveal-delay", "280ms");
  visual.setAttribute("role", "group");
  visual.setAttribute("aria-label", `${project.title} images`);

  const slides = project.slides.map((slide, slidePosition) => {
    const figure = document.createElement("figure");
    figure.className = "project-slide";
    if (slidePosition === 0) figure.classList.add("is-active");

    const image = document.createElement("img");
    image.src = slide.src;
    image.alt = slide.alt;
    image.loading =
      projectPosition === 0 && slidePosition === 0 ? "eager" : "lazy";
    image.decoding = "async";
    figure.append(image);
    visual.append(figure);
    return figure;
  });

  const controls = document.createElement("div");
  controls.className = "slider-controls";
  controls.hidden = slides.length < 2;
  controls.setAttribute("aria-label", "Project image controls");

  let activeSlide = 0;
  const previous = document.createElement("button");
  previous.className = "slider-control";
  previous.type = "button";
  previous.textContent = "Previous";
  previous.setAttribute("aria-label", "Previous image");

  const slideCount = document.createElement("span");
  slideCount.setAttribute("aria-live", "polite");

  const next = document.createElement("button");
  next.className = "slider-control";
  next.type = "button";
  next.textContent = "Next";
  next.setAttribute("aria-label", "Next image");

  function showSlide(newPosition) {
    activeSlide = (newPosition + slides.length) % slides.length;
    slides.forEach((slide, slidePosition) => {
      slide.classList.toggle("is-active", slidePosition === activeSlide);
    });
    slideCount.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }

  previous.addEventListener("click", () => showSlide(activeSlide - 1));
  next.addEventListener("click", () => showSlide(activeSlide + 1));
  showSlide(0);
  controls.append(previous, slideCount, next);
  visual.append(controls);

  panel.append(caption, visual);

  const indexItem = document.createElement("li");
  const indexLink = document.createElement("a");
  indexLink.href = `#${projectId}`;

  const indexNumber = document.createElement("span");
  indexNumber.textContent = `( ${project.number} )`;
  const indexTitle = document.createElement("span");
  indexTitle.textContent = project.title;
  const indexLocation = document.createElement("span");
  indexLocation.textContent = project.location;

  indexLink.append(indexNumber, indexTitle, indexLocation);
  indexItem.append(indexLink);
  indexList.append(indexItem);

  return panel;
}

projects.forEach((project, projectPosition) => {
  projectContainer.append(createProject(project, projectPosition));
});

const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".project.is-current").forEach((project) => {
        project.classList.remove("is-current");
      });
      entry.target.classList.add("is-current");
    });
  },
  { threshold: 0.6 },
);

document.querySelectorAll(".project").forEach((project) => {
  projectObserver.observe(project);
});

document.querySelectorAll("[data-open-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById(button.dataset.openDialog)?.showModal();
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog")?.close());
});

document.querySelectorAll(".site-dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

indexList.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    document.querySelector("#project-index")?.close();
  }
});
