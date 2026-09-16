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

    const imageFiles = files.filter(file =>
      file.type === "file" &&
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)
    );

    // Get metadata for every image first
    const images = await Promise.all(
      imageFiles.map(async (file) => {
        let date = null;

        try {
          // SVGs generally don't contain EXIF metadata
          if (!/\.svg$/i.test(file.name)) {
            const data = await exifr.parse(file.download_url, {
              tiff: true,
              exif: true,
              xmp: true
            });

            const exifDate =
              data?.DateTimeOriginal ||
              data?.CreateDate ||
              data?.DateTimeCreated ||
              data?.ModifyDate ||
              data?.DateTime;

            if (exifDate) {
              const parsedDate =
                exifDate instanceof Date
                  ? exifDate
                  : new Date(exifDate);

              if (!isNaN(parsedDate.getTime())) {
                date = parsedDate;
              }
            }
          }
        } catch (metadataError) {
          console.error(
            `Could not extract metadata from ${file.name}:`,
            metadataError
          );
        }

        return {
          file,
          date
        };
      })
    );

    // Sort newest first
    images.sort((a, b) => {
      // Images without dates go to the end
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;

      return b.date - a.date;
    });

    // Now create the gallery in sorted order
    for (const { file, date } of images) {
      const div2 = document.createElement("div");
      div2.className = "col-12 col-md-6 col-xl-4";

      const article = document.createElement("article");
      article.setAttribute("data-aos", "fade-up");

      const img = document.createElement("img");
      img.src = file.download_url;
      img.alt = file.name;
      img.loading = "lazy";

      const metadata = document.createElement("p");

      if (/\.svg$/i.test(file.name)) {
        metadata.innerHTML = `
          <small class="text-muted">
            SVG — no EXIF metadata.
          </small>
        `;
      } else if (date) {
        metadata.textContent = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      } else {
        metadata.textContent = "No date metadata.";
      }

      article.appendChild(metadata);
      article.appendChild(img);

      div2.appendChild(article);
      gallery.appendChild(div2);
    }

  } catch (error) {
    console.error(error);
    gallery.textContent = "Unable to load images.";
  }
}

loadImages();
