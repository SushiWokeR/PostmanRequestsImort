interface RequestsList {
        name: string;
        event: {
            listen: string;
            script: {
                exec: string[];
                type: string;
            };
        }[];
        request: {
            method: string;
            header: {
                key: string;
                value: string;
                type: string;
            }[];
            body: {
                mode: string;
                raw: string;
            };
            url: {
                raw: string;
                host: string[];
                path: string[];
            };
        };
        response: never[];
}



const testScript = [
  "if (pm.variables.get(\"MiOrder\") === 'true') {\r",
  "  const response = JSON.parse(responseBody);\r",
  "  const currentProduct = pm.variables.get(\"MiProducts\");\r",
  "  const currentMi = pm.variables.get(\"MiNames\");\r",
  "  let pdfTemplate = `\r",
  "<html>\r",
  "    <head>\r",
  "        <script src=\"https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js\"></script>\r",
  "        <script src=\"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.min.js\" integrity=\"sha512-9Wd08apcJEwm8g3lBTg1UW/njdN0iuuOVWKpyinK3uA7ISAE5PmEZ4y8bZYTXVOE3tlt7aFlCBBLmLt5cUxe2Q==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>\r",
  "        <script src=\"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js\" integrity=\"sha512-kYruxZBxGQJy6pFwz9JVe6FCgCZEPPvxC3eoy4A+fCMWcSGqPxxGC7M1S6eyXCBfm/4d7l4cf8XNoULZQQ+MtQ==\" crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>\r",
  "    </head>\r",
  "    <body>\r",
  "        <div>\r",
  "            <button id=\"prev\">Previous</button>\r",
  "            <button id=\"next\">Next</button>\r",
  "            &nbsp; &nbsp;\r",
  "            <span>Page: <span id=\"page_num\"></span> / <span id=\"page_count\"></span></span>\r",
  "        </div>\r",
  "        <canvas id=\"the-canvas\"></canvas>\r",
  "        <script type=\"text/javascript\">\r",
  "            var pdfjsLib = window['pdfjs-dist/build/pdf'];\r",
  "\r",
  "            // The workerSrc property shall be specified.\r",
  "            // pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';\r",
  "            console.log(\"inside\", \"{{pdfBase64}}\")\r",
  "            const pdfBlob = atob(\"${response.payload[currentProduct][currentMi].base64EncodedPdfString}\");\r",
  "            const pdfData = pdfBlob;\r",
  "\r",
  "            var pdfDoc = null,\r",
  "            pageNum = 1,\r",
  "            pageRendering = false,\r",
  "            pageNumPending = null,\r",
  "            scale = 2,\r",
  "            canvas = document.getElementById('the-canvas'),\r",
  "            ctx = canvas.getContext('2d');\r",
  "\r",
  "            /**\r",
  "            * Get page info from document, resize canvas accordingly, and render page.\r",
  "            * @param num Page number.\r",
  "            */\r",
  "            function renderPage(num) {\r",
  "            pageRendering = true;\r",
  "            // Using promise to fetch the page\r",
  "            pdfDoc.getPage(num).then(function(page) {\r",
  "            var viewport = page.getViewport({scale: scale});\r",
  "            canvas.height = viewport.height;\r",
  "            canvas.width = viewport.width;\r",
  "\r",
  "            // Render PDF page into canvas context\r",
  "            var renderContext = {\r",
  "                canvasContext: ctx,\r",
  "                viewport: viewport\r",
  "            };\r",
  "            var renderTask = page.render(renderContext);\r",
  "\r",
  "            // Wait for rendering to finish\r",
  "            renderTask.promise.then(function() {\r",
  "                pageRendering = false;\r",
  "                if (pageNumPending !== null) {\r",
  "                // New page rendering is pending\r",
  "                renderPage(pageNumPending);\r",
  "                pageNumPending = null;\r",
  "                }\r",
  "            });\r",
  "            });\r",
  "\r",
  "            // Update page counters\r",
  "            document.getElementById('page_num').textContent = num;\r",
  "            }\r",
  "\r",
  "            /**\r",
  "            * If another page rendering in progress, waits until the rendering is\r",
  "            * finised. Otherwise, executes rendering immediately.\r",
  "            */\r",
  "            function queueRenderPage(num) {\r",
  "            if (pageRendering) {\r",
  "            pageNumPending = num;\r",
  "            } else {\r",
  "            renderPage(num);\r",
  "            }\r",
  "            }\r",
  "\r",
  "            /**\r",
  "            * Displays previous page.\r",
  "            */\r",
  "            function onPrevPage() {\r",
  "            if (pageNum <= 1) {\r",
  "            return;\r",
  "            }\r",
  "            pageNum--;\r",
  "            queueRenderPage(pageNum);\r",
  "            }\r",
  "            document.getElementById('prev').addEventListener('click', onPrevPage);\r",
  "\r",
  "            /**\r",
  "            * Displays next page.\r",
  "            */\r",
  "            function onNextPage() {\r",
  "            if (pageNum >= pdfDoc.numPages) {\r",
  "            return;\r",
  "            }\r",
  "            pageNum++;\r",
  "            queueRenderPage(pageNum);\r",
  "            }\r",
  "            document.getElementById('next').addEventListener('click', onNextPage);\r",
  "\r",
  "            /**\r",
  "            * Asynchronously downloads PDF.\r",
  "            */\r",
  "            pdfjsLib.getDocument({data: pdfData}).promise.then(function(pdfDoc_) {\r",
  "            pdfDoc = pdfDoc_;\r",
  "            document.getElementById('page_count').textContent = pdfDoc.numPages;\r",
  "\r",
  "            // Initial/first page rendering\r",
  "            renderPage(pageNum);\r",
  "            });\r",
  "\r",
  "\r",
  "            // Loaded via <script> tag, create shortcut to access PDF.js exports.\r",
  "            var pdfjsLib = window['pdfjs-dist/build/pdf'];\r",
  "\r",
  "            // The workerSrc property shall be specified.\r",
  "            pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';\r",
  "\r",
  "            // Using DocumentInitParameters object to load binary data.\r",
  "            var loadingTask = pdfjsLib.getDocument({data: pdfData});\r",
  "            loadingTask.promise.then(function(pdf) {\r",
  "            console.log('PDF loaded');\r",
  "\r",
  "            // Fetch the first page\r",
  "            var pageNumber = 1;\r",
  "            pdf.getPage(pageNumber).then(function(page) {\r",
  "            console.log('Page loaded');\r",
  "            \r",
  "            var scale = 2;\r",
  "            var viewport = page.getViewport({scale: scale});\r",
  "\r",
  "            // Prepare canvas using PDF page dimensions\r",
  "            var canvas = document.getElementById('the-canvas');\r",
  "            var context = canvas.getContext('2d');\r",
  "            canvas.height = viewport.height;\r",
  "            canvas.width = viewport.width;\r",
  "\r",
  "            // Render PDF page into canvas context\r",
  "            var renderContext = {\r",
  "                canvasContext: context,\r",
  "                viewport: viewport\r",
  "            };\r",
  "            var renderTask = page.render(renderContext);\r",
  "            renderTask.promise.then(function () {\r",
  "                console.log('Page rendered');\r",
  "            });\r",
  "            });\r",
  "            }, function (reason) {\r",
  "            // PDF loading error\r",
  "            console.error(reason);\r",
  "            });\r",
  "        </script>\r",
  "    </body>\r",
  "</html>`\r",
  "  pm.visualizer.set(pdfTemplate)\r",
  "}"
]

const importFileConstructor = (items: RequestsList[]) => {
  const file = {
    info: {
      _postman_id: "c50b10b7-ddd8-402b-824e-65ee0ff8718e",
      name: "PMIRate Pro",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      _exporter_id: "16890073"
    },
    item: items,
    event: [
      {
        listen: "prerequest",
        script: {
          type: "text/javascript",
          exec: [
            "function padTo2Digits(num) {",
            "  return num.toString().padStart(2, '0');",
            "}",
            "",
            "function formatDate(date) {",
            "  return [",
            "    date.getFullYear(),",
            "    padTo2Digits(date.getMonth() + 1),",
            "    padTo2Digits(date.getDate()),",
            "  ].join('-');",
            "}",
            "const currentDate = formatDate(new Date())",
            "",
            "pm.environment.set(\"currentDate\", currentDate);",
            "",
            "const timestamp = Date.now().toString()",
            "const fakeSsn = timestamp.substring(timestamp.length - 9)",
            "pm.environment.set(\"fakeSsn\", fakeSsn);",
          ]
        }
      },
      {
        listen: "test",
        script: {
          type: "text/javascript",
          exec: [
            ""
          ]
        }
      }
    ]
  }
  return fs.appendFile('./importFile.json', JSON.stringify(file))
}



let itemList: RequestsList[] = [];

const itemBuilder = (fileName: string, fileBody: string) => {
  itemList.push(
    {
			name: fileName,
			event: [
				{
					listen: "test",
					script: {
						exec: testScript,
						type: "text/javascript"
					}
				}
			],
			request: {
				method: "POST",
				header: [
					{
						key: "Client-Id",
						value: "{{Client-Id}}",
						type: "text"
					},
					{
						key: "Api-Key",
						value: "{{Api-Key}}",
						type: "text"
					},
					{
						key: "Content-Type",
						value: "application/xml; charset=utf-8",
						type: "text"
					}
				],
				body: {
					mode: "raw",
					raw: fileBody
				},
				url: {
					"raw": "{{host}}/v3/quote_all",
					host: [
						"{{host}}"
					],
					path: [
						"v3",
						"quote_all"
					]
				}
			},
			response: []
		},
  )
}




let fileNames: string[]
let fileBodyes: string[] = []


  import fs from 'fs/promises';

  async function example() {
    try {
      fileNames = await fs.readdir('./XMLs', { encoding: 'utf8' });
      // console.log(fileNames);
      for (let i = 0; i < fileNames.length; i++) {
        try {
          const filePath = (`./XMLs/${fileNames[i]}`);
          const contents = await fs.readFile(filePath, { encoding: 'utf8' });
          fileBodyes.push(contents)
          // console.log(contents);
          itemBuilder(fileNames[i], contents)
        } catch (err) {
          console.error(`../XMLs/${fileNames[i]}`, err.message);
        }
      }
      importFileConstructor(itemList)
    } catch (err) {
      console.log(err);
    }
  }
  example();