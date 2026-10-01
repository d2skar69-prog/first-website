const services = [
  {
    title: "PRODUCTION",
    image: "production.png",
    description: "END-TO-END PRODUCTION FOR FILMS, PHOTOGRAPHY AND BRANDED CONTENT, FROM CONCEPT TO FINAL DELIVERY.",
  },
  {
    title: "MOTION",
    image: "motion.jpg",
    description: "TITLE DESIGN, ANIMATION, MOTION GRAPHICS AND VFX FOR SCREENS OF EVERY SIZE.",
  },
  {
    title: "BRANDS",
    image: "brands.png",
    description: "BUILDING AND INCUBATING BRANDS THROUGH STRATEGY, IDENTITY AND DESIGN.",
  },
  {
    title: "EXPERIENCES",
    image: "experiences.jpg",
    description: "STRATEGY, CREATIVE DIRECTION AND EXECUTION FOR EVENTS, LAUNCHES AND BRAND EXPERIENCES.",
  },
] as const;

export default function HomeServices() {
  return (
    <section id="services" className="home-services" aria-labelledby="home-services-title">
      <h2 id="home-services-title" className="home-label">[SERVICES]</h2>
      <div className="home-services__grid">
        {services.map((service) => (
          <article className="home-service" key={service.title} data-testid={`card-home-service-${service.title.toLowerCase()}`}>
            <div className="home-service__visual">
              <img src={`${import.meta.env.BASE_URL}assets/home/${service.image}`} alt="" loading="lazy" />
              <h3>{service.title}</h3>
            </div>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}