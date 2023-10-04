const express=require('express');
const axios=require('axios');
const app=express();
const lodash=require('lodash');
const cors=require('cors');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({origin: 'http://localhost:3000',credentials: true,}));

app.get('/api/blog-stats',async (req,res)=>{
    try {
        const config = {
            method: 'get',
            url: 'https://intent-kit-16.hasura.app/api/rest/blogs',
            headers: { 'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6' }
        };
        const response=await axios(config);
        const dummy=lodash.filter(response.data.blogs,item=>lodash.includes(item.title.toLowerCase(),'privacy'));
        const data={
            "total":lodash.size(response.data.blogs),
            "largestTitle":lodash.maxBy(response.data.blogs,item=>item.title.length).title,
            "titleWithPrivacy":dummy.length,
            uniqueTitle:lodash.uniqBy(response.data.blogs,'title'),
        }
        res.send(data);
    } catch (error) {
        res.status(400).json(error);
        console.log(error);
    }
})

function filterBlog(blogs,query)
{
    const filteredTitles = blogs.filter(title => title.title.toLowerCase().includes(query.toLowerCase()));
    return filteredTitles;
}
app.get('/api/blog-search',async(req,res)=>{
    const encodedQuery=req.query.query;
    const query=decodeURIComponent(encodedQuery);
    try {
        const config = {
            method: 'get',
            url: 'https://intent-kit-16.hasura.app/api/rest/blogs',
            headers: { 'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6' }
        };
        const response=await axios(config);
        let blogs=response.data.blogs;
        if (!query) {
            return res.status(400).json({ error: 'query is required.' });
        }
        const memoiozeQuery=lodash.memoize(filterBlog);
        res.send(memoiozeQuery(blogs,query));
    } catch (error) {
        console.log(error);
    }
});
app.listen(4000);