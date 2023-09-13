document.addEventListener("DOMContentLoaded", function () {
    let head = document.head;

    let customCSS = document.createElement("link");
    customCSS.rel = "stylesheet";
    customCSS.href = "style.css";
    head.appendChild(customCSS);

    let bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css";
    bootstrapCSS.integrity = "sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT";
    bootstrapCSS.crossOrigin = "anonymous";
    head.appendChild(bootstrapCSS);

    let bootstrapJS = document.createElement("script");
    bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js";
    bootstrapJS.integrity = "sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8";
    bootstrapJS.crossOrigin = "anonymous";
    head.appendChild(bootstrapJS);
});