import * as http from 'http';
import fs from 'fs';
import path from 'path';

const port = 5000;
const server = http.createServer((req,res)=>{
    if(req.url === '/products'){
        const filePath = path.join(__dirname,'data','products.jso');
        fs.access(filePath, (err) => {
            if (err) {
                console.error('File does not exist:', filePath);
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'File not found' }));
                return;
            }
            fs.readFile(filePath,'utf8',(err,data)=>{
                res.writeHead(200,{'Content-Type':'application/json'});
                console.log('Data:',JSON.parse(data));
                res.write(data);
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
                    <input type="text" name="name" placeholder="Product Name" required>
                    <input type="number" name="price" placeholder="Product Price" required>
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
            console.log('Form Data:', formData);

            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({
                'message':'Product added successfully',
                'product':{
                    name:formData.get('name'),
                    price:formData.get('price')
                }
            }));
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