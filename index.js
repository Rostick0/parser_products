const puppeteer = require("puppeteer");
const fs = require("fs");
// const { Client } = require('pg');

// const client = new Client({
//     user: 'postgres',
//     host: '127.0.0.1',
//     database: 'emarket_db',
//     password: '',
//     port: 5432,
//     idleTimeoutMillis: 0,
//     connectionTimeoutMillis: 0,
// });

// client.connect();

function insertProduct(data) {
  const query = `INSERT INTO product (title, link, img, price, category, shop) VALUES ('${data.title}', '${data.link}', '${data.img}', '${data.price}', '${data.category}', '${data.shop}');`;

  return query;
}

// citilink
(async function () {
  const link = "https://www.citilink.ru/catalog/noutbuki/";
  const awaitSelector = "div[data-meta-name=Pagination__load-more]";

  const browser = await puppeteer.launch({
    // headless: true,
    slowMo: 100,
    devtools: true,
    // timeout: 0
  });
  try {
    const page = await browser.newPage();

    // page.setDefaultNavigationTimeout(0);
    // await page.setViewport(
    //     {
    //         width: 480,
    //         height: 480
    //     }
    // )
    await page.goto(`${link}`);
    await page.waitForSelector(awaitSelector);
    const pages = await page.evaluate(async () => {
      const links = [];

      try {
        // тег карточки товара
        const products = document.querySelectorAll(
          "div[data-meta-name=ProductHorizontalSnippet]"
        );

        products.forEach((elem) => {
          // тег ссылки товара
          // const a = elem.querySelector("a.ProductCardHorizontal__title");
          const title = elem.querySelector(
            "a[data-meta-name=Snippet__title]"
          ).href;

          // const data = {
          //   // заголовок товара
          //   title,
          //   // ссылка товара
          //   // link: a.href,
          //   // изображение товара
          //   // img: elem.querySelector("img.ProductCardHorizontal__image").src,
          //   // // img: elem.querySelector('img').getAttribute('data-src'),
          //   // // цена товара
          //   // price: elem.querySelector(
          //   //   "span.ProductCardHorizontal__price_current-price"
          //   // ).textContent,
          //   // категория
          //   category: "smartfony",
          //   // магазин
          //   shop: "citilink",
          //   //title, link, img, price, category, shop
          // };

          links.push(title);
        });
      } catch (e) {
        console.error(e);
      }
      return links;
    });

    const data = [];
    for await (const item of pages.splice(0, 4)) {
      const page = await browser.newPage();
      try {
        await page.goto(`${item}/properties/`);

        data.push(
          await page.evaluate(async () => ({
            title: document.querySelector("h1").textContent,
            // description: document.querySelector(
            //   'div[data-meta-name="Collapse__content"] div'
            // )?.innerHTML,
            images: [
              ...document.querySelectorAll(
                'div[data-meta-name="ImageGallery__main"] img'
              ),
            ]?.map((item) => item?.src),
          }))
        );
      } catch (e) {}

      // await page.close();
    }

    // const html = pages.forEach(async (item) => {
    //   return data;
    // });
    // await browser.close();

    // let querySQL = "";

    // html.forEach((elem) => {
    //   querySQL += insertProduct(elem);
    // });

    fs.writeFile("data.json", JSON.stringify(data), (err) => {
      if (err) console.log(err);
    });

    // client.query(querySQL);

    // client.end();
  } catch (e) {
    console.error(e);
  }

  // await browser.close();
})();

// dns
// (async function () {
//   // const link = "https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/";
//   const link = "https://www.citilink.ru/catalog/noutbuki/";

//   const awaitSelector = "a.pagination-widget__page-link";
//   try {
//     const browser = await puppeteer.launch({
//       // executablePath: "/Applications/Yandex.app/Contents/MacOS/Yandex",
//       headless: false,
//       slowMo: 100,
//       // devtools: true,
//       // timeout: 0
//     });

//     const page = await browser.newPage();

//     await page.setExtraHTTPHeaders({
//       referer: "www.google.com",
//       accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//       "accept-language": "en-US,en;q=0.9",
//       cookie:
//         "prov=4568ad3a-2c02-1686-b062-b26204fd5a6a; usr=p=%5b10%7c15%5d%5b160%7c%3bNewest%3b%5d",
//     });

//     page.setDefaultNavigationTimeout(0);
//     // await page.setViewport(
//     //     {
//     //         width: 480,
//     //         height: 480
//     //     }
//     // )
//     await page.goto(`${link}`);
//     await page.waitForSelector(awaitSelector);

//     const html = await page.evaluate(async () => {
//       const page = [];

//       try {
//         // тег карточки товара
//         const products = document.querySelectorAll("div.catalog-product");

//         products.forEach((elem) => {
//           // тег ссылки товара
//           const a = elem.querySelector("a.catalog-product__name");

//           const data = {
//             // заголовок товара
//             title: a.textContent,
//             // ссылка товара
//             link: a.href,
//             // изображение товара
//             img: elem.querySelector("img").getAttribute("data-src"),
//             //elem.querySelector('img.loaded').data-srcset, querySelector('img.loaded').getAttribute('srcset') data-src data-srcset
//             //elem.querySelector('source').getAttribute('srcset')
//             // цена товара
//             price: elem.querySelector("div.product-buy__price").textContent,
//             // категория
//             category: "notebook",
//             // магазин
//             shop: "dns",
//             //title, link, img, price, category, shop
//           };

//           page.push(data);
//         });
//       } catch (e) {
//         console.error(e);
//       }
//       return page;
//     });

//     await browser.close();

//     let querySQL = "";

//     html.forEach((elem) => {
//       querySQL += insertProduct(elem);
//     });

//     fs.writeFile("data.json", JSON.stringify(html), (err) => {
//       if (err) console.log(err);
//     });

//     // client.query(querySQL);

//     // client.end();
//   } catch (e) {
//     console.error(e);
//   }
// })();

// mvidie
// (async function () {
//   const link =
//     "https://www.mvideo.ru/komputernaya-tehnika-4107/sistemnye-bloki-80?reff=menu_main";
//   const awaitSelector = "footer.footer";
//   const result = [];
//   try {
//     let browser = await puppeteer.launch({
//       headless: false,
//       slowMo: 100,
//       devtools: true,
//       // timeout: 0
//     });

//     let page = await browser.newPage();

//     await page.setDefaultNavigationTimeout(0);
//     await page.setViewport({
//       width: 480,
//       height: 480,
//     });
//     await page.goto(`${link}`);
//     await page.waitForSelector(awaitSelector);

//     let html = await page.evaluate(async () => {
//       const page = [];

//       try {
//         // тег карточки товара
//         const products = document.querySelectorAll("div.product-card--mobile");

//         products.forEach((elem) => {
//           // тег ссылки товара
//           const a = elem.querySelector("a.product-title__text");

//           const data = {
//             // заголовок товара
//             title: a.textContent,
//             // ссылка товара
//             link: a.href,
//             // изображение товара
//             img: elem.querySelector(
//               "img.product-picture__img.product-picture__img--mobile"
//             ).src,
//             // img: elem.querySelector('img').getAttribute('data-src'),
//             // цена товара
//             price: elem.querySelector("span.price__main-value").textContent,
//             // категория
//             category: "computer",
//             // магазин
//             shop: "mvideo",
//             //title, link, img, price, category, shop
//           };

//           page.push(data);
//         });
//       } catch (e) {
//         console.error(e);
//       }
//       return page;
//     });

//     await browser.close();

//     let querySQL = "";

//     html.forEach((elem) => {
//       querySQL += insertProduct(elem);
//     });

//     fs.writeFile("data.json", JSON.stringify(html), (err) => {
//       if (err) console.log(err);
//     });

//     // client.query(querySQL);

//     // client.end();
//   } catch (e) {
//     console.error(e);

//     await browser.close();
//   }
// });

// ozon
// (async function () {
//   const link = "https://www.ozon.ru/category/noutbuki-15692/";
//   const awaitSelector = "a.u8t.t9u";
//   const result = [];
//   try {
//     let browser = await puppeteer.launch({
//       headless: false,
//       slowMo: 100,
//       devtools: true,
//       // timeout: 0
//     });

//     let page = await browser.newPage();

//     await page.setDefaultNavigationTimeout(0);
//     // await page.setViewport(
//     //     {
//     //         width: 480,
//     //         height: 480
//     //     }
//     // )
//     await page.goto(`${link}`);
//     await page.waitForSelector(awaitSelector);

//     let html = await page.evaluate(async () => {
//       const page = [];

//       try {
//         // тег карточки товара
//         const products = document.querySelectorAll("div.i0s.si0");

//         products.forEach((elem) => {
//           // тег ссылки товара
//           const a = elem.querySelector("a.tile-hover-target.i3q");

//           const data = {
//             // заголовок товара
//             title: a.textContent,
//             // ссылка товара
//             link: a.href,
//             // изображение товара
//             img: elem.querySelector("img.ui-r4").src,
//             // img: elem.querySelector('img').getAttribute('data-src'),
//             // цена товара
//             price: elem.querySelector("span.ui-s5.ui-s8").textContent,
//             // категория
//             category: "notebook",
//             // магазин
//             shop: "ozon",
//             //title, link, img, price, category, shop
//           };

//           page.push(data);
//         });
//       } catch (e) {
//         console.error(e);
//       }
//       return page;
//     });

//     await browser.close();

//     let querySQL = "";

//     html.forEach((elem) => {
//       querySQL += insertProduct(elem);
//     });

//     fs.writeFile("data.json", JSON.stringify(html), (err) => {
//       if (err) console.log(err);
//     });

//     // client.query(querySQL);

//     // client.end();
//   } catch (e) {
//     console.error(e);

//     await browser.close();
//   }
// });

// .eldorado
// (async function () {
//   const link = "https://www.eldorado.ru/c/noutbuki/";
//   const awaitSelector = "footer.Ha";
//   const result = [];
//   try {
//     let browser = await puppeteer.launch({
//       headless: false,
//       slowMo: 100,
//       devtools: true,
//       // timeout: 0
//     });

//     let page = await browser.newPage();

//     await page.setDefaultNavigationTimeout(0);
//     // await page.setViewport(
//     //     {
//     //         width: 480,
//     //         height: 480
//     //     }
//     // )
//     await page.goto(`${link}`);
//     await page.waitForSelector(awaitSelector);

//     let html = await page.evaluate(async () => {
//       const page = [];

//       try {
//         // тег карточки товара
//         const products = document.querySelectorAll("li.YF._dy_win");

//         products.forEach((elem) => {
//           // тег ссылки товара
//           const a = elem.querySelector("a.gG");

//           const data = {
//             // заголовок товара
//             title: a.textContent,
//             // ссылка товара
//             link: a.href,
//             // изображение товара
//             img: elem.querySelector("img.hz").src,
//             // img: elem.querySelector('img').getAttribute('data-src'),
//             // цена товара
//             price: elem.querySelector("span.vS.CS").textContent,
//             // категория
//             category: "notebook",
//             // магазин
//             shop: "eldorado",
//             //title, link, img, price, category, shop
//           };

//           page.push(data);
//         });
//       } catch (e) {
//         console.error(e);
//       }
//       return page;
//     });

//     await browser.close();

//     let querySQL = "";

//     html.forEach((elem) => {
//       querySQL += insertProduct(elem);
//     });

//     fs.writeFile("data.json", JSON.stringify(html), (err) => {
//       if (err) console.log(err);
//     });

//     // client.query(querySQL);

//     // client.end();
//   } catch (e) {
//     console.error(e);

//     await browser.close();
//   }
// });

// link - ссылка;
// awaitSelector - тэг который необходимо подождать, чтобы браузер досрочно не закрылся, можно использовать футер страницы или тэг нижней навигации;
// divsProduct - тэг карточки продукта;
// aLink - обычно в магазинах используется заголовок ввиде ссылки
// img, price - нужно дописать класс этих эллементов
// category, shop - указывается в самом коде в ручную
