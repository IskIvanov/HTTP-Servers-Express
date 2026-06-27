export const handlerReadiness = (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.set('charset=utf-8');
    res.send("OK");
};
