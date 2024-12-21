import { en, Faker, vi } from "@faker-js/faker";
import fs from "fs";

const faker = new Faker({
    locale: [vi, en],
});

(async () => {
    const images: string[] = [];

    //pixabay.com/api?key=47135253-c5e16dd30be3e708ade6d0c2f&q=room&image_type=photo
    for (let i = 0; i < 5; i++) {
        console.log(i);

        await fetch(
            `https://pixabay.com/api?key=47135253-c5e16dd30be3e708ade6d0c2f&q=Villa&image_type=photo&per_page=200&page=${i}`
        )
            .then((response) => {
                return response.json();
            })
            .then((data: any) => {
                data.hits.forEach((hit: any) => {
                    images.push(hit.largeImageURL);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    fs.writeFile(
        __dirname + "/data/images.json",
        JSON.stringify(images, null, 4),
        (err) => {
            if (err) {
                console.error(err);
            }

            console.log("Images generated!");
        }
    );
})();

// (async () => {
//     fs.readFile(__dirname + "/data/images.json", (err, data) => {
//         if (err) {
//             console.error(err);
//         }
//         const images = JSON.parse(data.toString());
//         console.log(images.length);
//         const uniqueImages = [...new Set(images)];
//         console.log("🚀 ~ fs.readFile ~ uniqueImages:", uniqueImages, uniqueImages.length);
//     });
// })();
