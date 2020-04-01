function mailOptions() {
    this.from = "ohmytenniso@gmail.com",
        this.to = '',
        this.cc = '',
        this.bcc = '',
        this.subject = '',
        //this.text = '',
        this.html = ''
};
mailOptions.prototype.from = function (from) {
    this.from = from;
};
mailOptions.prototype.to = function (to) {
    this.to = to;
};
mailOptions.prototype.subject = function (subject) {
    this.subject = subject;
};
mailOptions.prototype.cc = function (cc) {
    this.cc = cc;
};
mailOptions.prototype.bcc = function (bcc) {
    this.bcc = bcc;
};
mailOptions.prototype.html = function (html) {
    this.html = html;
};
module.exports = mailOptions;