import * as http from 'http';
import fs, { write } from 'fs';
import path from 'path';
import { title } from 'process';

const port = 5000;
const filePath = path.join(__dirname,'data','products.json');

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


    }else if(req.url === '/products/new'){
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
    } else if(req.method === "POST" && req.url === "/add-product"){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end',()=>{
            const formData = new URLSearchParams(body);
            const productitle = formData.get('title');
            const productdescription = formData.get('description');


            fs.access(filePath, (err) => {
                if (err) {
                    console.error('File does not exist:', filePath);
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'File not found' }));
                    return;
                }
    
                fs.readFile(filePath,'utf8',(err,data)=>{
                    const jsonProducts : {products:[{id:number, title: string, description: string}]} = JSON.parse(data);
                    const submittedData = {
                        id:jsonProducts.products.length + 1,
                        title:productitle as string,
                        description:productdescription as string,
                    };
    
                    jsonProducts.products.push(submittedData);
                    const updatedData = JSON.stringify(jsonProducts, null, 2);
    
                    fs.writeFile(filePath,updatedData,{flag:"w"}, (err) => {
                        console.error('Error writing file:', err);
                    });
                    res.writeHead(200,{'Content-Type':'application/json'});
                    res.end(JSON.stringify({
                        'message':'Product added successfully',
                        'product':{
                            title:productitle,
                            price:productdescription
                        }
                    }));
                });
            });

        });
    } else if(req.url === '/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<h1>Welcome to the Home Page</h1>');
        res.end()
    } else {
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