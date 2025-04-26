import * as http from 'http';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

const port = 5000;
const filePath = path.join(__dirname,'data','products.json');
const assetsPath = path.join(__dirname,'assets');
console.log(assetsPath);

const server = http.createServer((req,res)=>{
    if(req.url === '/products'){
        fs.access(filePath, (err) => {
            if (err) {
                console.error('File does not exist:', filePath);
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'File not found' }));
                return;
            }

            fs.readFile(filePath,'utf8',(err,data)=>{
                const jsonProducts : {products:[{id:number, title: string, description: string}]} = JSON.parse(data);
                const productData = JSON.stringify(jsonProducts, null, 2);
                res.writeHead(200,{'Content-Type':'application/json'});
                console.log('Data:',productData);
                res.write(productData);
                res.end()
            });
        });

    }
    else if(req.url === '/products/new'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(`
            <head><title>Add New Product</title></head>
            <body>
                <h1>Add New Product</h1>
                <form action="/add-product" method="POST">
                    <input type="text" id="title" name="title" placeholder="Product Name" required><br><br>
                    <input type="textarea" id="title" name="description" placeholder="Product Description" required><br><br>
                    <button type="submit">Add Product</button>
                </form>
            </body>    
        `);
        res.end()
    }
    else if(req.method === "POST" && req.url === "/add-product"){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end',async ()=>{
            const formData = new URLSearchParams(body);
            const productitle = formData.get('title');
            const productdescription = formData.get('description');

            try{
                const jsonData = await fsPromises.readFile(filePath,'utf8');
                
                const jsonProducts : {products:[{id:number, title: string, description: string}]} = JSON.parse(jsonData);

                jsonProducts.products.push({
                    id:jsonProducts.products.length + 1,
                    title:productitle as string,
                    description:productdescription as string,    
                });

                const updatedData = JSON.stringify(jsonProducts, null, 2);

                await fsPromises.writeFile(filePath,updatedData,{flag:"w"});

                res.writeHead(200,{'Content-Type':'application/json'});
                res.end(JSON.stringify({
                    'message':'Product added successfully',
                    'product':{
                        title:productitle,
                        price:productdescription
                    }
                }));

            } catch(err){
                
                console.error(err);
            
            }

            fs.access(filePath, (err) => {
                if (err) {
                    console.error('File does not exist:', filePath);
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'File not found' }));
                    return;
                }
            });

        });
    } 
    else if(req.method === "GET" && req.url === "/assets") {
        fs.access(assetsPath, (err) => {
            if(err){
                console.error('Assets directory does not exist:', assetsPath);
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Assets directory not found' }));
                return;
            }

            fs.readdir(assetsPath, (err, files) => {
                if(err){
                    console.error('Error reading assets directory:', err);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    return;
                }

                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<h1>Assets Directory</h1>');
                res.write('<ul>');
                files.forEach(file => {
                    res.write(`<li><a href="/delete?file=${encodeURIComponent(file)}">${file}</a></li>`);
                });
                res.write('</ul>');
                res.end();
            });
        });
    }
    else if(req.method === "GET" && req.url?.startsWith("/delete")) {
        const file = decodeURIComponent(req.url.split('?')[1].split('=')[1]);
        const assetFilePath = path.join(assetsPath, file);
        // ** TODO check if the file exists in the assets directory
        fs.access(assetFilePath, async(err) => {
            if(err){
                console.error('File does not exist:', file);
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'File not found' }));
                return;
            }
            try{
                await fsPromises.unlink(assetFilePath);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: `File: ${file} deleted successfully` }));
            } catch(err){
                console.error('Error deleting file:', err);
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
                return;
            }
        }
        );
    }
    else if(req.url === '/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<h1>Welcome to the Home Page</h1>');
        res.end()
    } 
    else {
        res.writeHead(404,{'Content-Type':'application/json'});
        const data = {
            message:'Not Found'
        };
        res.write(JSON.stringify(data));
        res.end()
    }

});
server.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})