const owner = "sono0202";
  const repo = "Sondre-Grini";
    const folder = "images/food";
    

const gallery = document.getElementById("gallery");

async function loadImages() {
  const apiUrl =
    `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();

    files
  .filter(file =>
    file.type === "file" &&
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
  )
  .forEach(async file => {

    const div = document.createElement("div");
    div.className = "row py-4";
    div.id = "image";

    const div1 = document.createElement("div");
    div1.className = "col-md-2";

    const div2 = document.createElement("div");
    div2.className = "col-md-8 mt-4";

    const article = document.createElement("article");

    const div3 = document.createElement("div");
    div3.className = "col-md-2";

    const img = document.createElement("img");
    img.src = file.download_url;
    img.alt = file.name;
    img.loading = "lazy";
    article.setAttribute("data-aos", "fade-up");

    const metadata = document.createElement("p");

    article.appendChild(metadata);
    article.appendChild(img);
    div2.appendChild(article);
    div.appendChild(div1);
    div.appendChild(div2);
    div.appendChild(div3);

    gallery.appendChild(div);

    try {

      // SVGs generally don't contain EXIF metadata
      if (/\.svg$/i.test(file.name)) {
        metadata.innerHTML = `
          <small class="text-muted">
            SVG — no EXIF metadata.
          </small>
        `;
        return;
      }

      const data = await exifr.parse(file.download_url, {
        tiff: true,
        
      });

    
      const exifDate = data.DateTimeOriginal;

      if (exifDate instanceof Date) {
        metadata.innerHTML = ` ${exifDate.toLocaleString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}`;
      }

      

    } catch (metadataError) {

      console.error(
        `Could not extract metadata from ${file.name}:`,
        metadataError
      );

      metadata.innerHTML = `
        <small class="text-danger">
          Could not read metadata.
        </small>
      `;
    }
  });


  } catch (error) {
    console.error("Could not load images:", error);
    gallery.textContent = "Unable to load images.";
  }
}
console.log("exifr:", exifr);

loadImages();
