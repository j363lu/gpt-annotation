import { Container } from "@mui/material";

function Footer() {
  return (
    <footer className="footer">
      <Container maxWidth="lg" sx={{color: "rgb(0,0,0,0.45)"}}>
        <p className="text-center bold">Disclaimer: This web application is only a demo. No data is stored on our server. <br /> We do not guarantee the accuracy of the results and are not responsible for them.</p>
        <div className="text-center contact">
          <span>Authors: Igor Grossmann, Jaxin Lu</span>
          <span>Contact email: j363lu@uwaterloo.ca</span>
        </div>

      </Container>
    </footer>
  );
}

export default Footer;