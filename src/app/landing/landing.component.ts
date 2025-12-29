import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

type Testimonial = {
  name: string;
  title: string;
  quote: string;
  videoSrc: string;
};

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container">
      <a class="navbar-brand fw-semibold" href="#">YourApp</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
              aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#testimonials">Testimonials</a></li>
          <li class="nav-item"><a class="nav-link" href="#features">Features</a></li>
        </ul>

        <!-- Profile dropdown -->
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                  type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle"></i>
            <span class="d-none d-sm-inline">{{ email() || 'Profile' }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li class="dropdown-item-text">
              <div class="fw-semibold">Signed in</div>
              <div class="text-muted small">{{ email() }}</div>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" (click)="logout()">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <header class="bg-light border-bottom">
    <div class="container py-5">
      <div class="row align-items-center g-4">
        <div class="col-12 col-lg-6">
          <h1 class="display-6 fw-bold mb-3">Professional dashboard experience</h1>
          <p class="text-muted mb-4">
            A clean, responsive landing page with navigation, profile dropdown, and a video testimonial carousel.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <a class="btn btn-primary" href="#testimonials">View Testimonials</a>
            <a class="btn btn-outline-secondary" href="#about">Learn More</a>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card shadow-sm border-0 rounded-4">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-3">
                <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                     style="width:48px;height:48px;">
                  <i class="bi bi-stars"></i>
                </div>
                <div>
                  <div class="fw-semibold">Quick summary</div>
                  <div class="text-muted small">Responsive • Bootstrap • Auth • Carousel</div>
                </div>
              </div>
              <hr />
              <div class="row g-3">
                <div class="col-6">
                  <div class="text-muted small">Device support</div>
                  <div class="fw-semibold">Mobile → Desktop</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Layout</div>
                  <div class="fw-semibold">Navbar + Sections</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Profile</div>
                  <div class="fw-semibold">Dropdown menu</div>
                </div>
                <div class="col-6">
                  <div class="text-muted small">Testimonials</div>
                  <div class="fw-semibold">Video carousel (RTL)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>

  <!-- About -->
  <section id="about" class="container py-5">
    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <h2 class="h3 fw-bold mb-3">About</h2>
        <p class="text-muted mb-0">
          This landing page is built with Bootstrap for a professional look and full responsiveness.
          It includes a navbar, profile dropdown, and a right-to-left video carousel of testimonials.
        </p>
      </div>
      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <div class="fw-semibold mb-2">Profile</div>
            <div class="text-muted small mb-3">Signed in as:</div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-envelope"></i>
              <span class="fw-semibold">{{ email() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Carousel (RTL) -->
  <section id="testimonials" class="bg-light border-top border-bottom">
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
        <div>
          <h2 class="h3 fw-bold mb-1">Testimonials</h2>
          <p class="text-muted mb-0">Video carousel that scrolls right-to-left</p>
        </div>
      </div>

      <div class="rtl-carousel">
        <div id="videoCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
          <div class="carousel-inner">

            <div class="carousel-item" *ngFor="let t of testimonials(); let i = index" [class.active]="i === 0">
              <div class="row g-4 align-items-stretch">
                <div class="col-12 col-lg-6">
                  <div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm">
                    <video [src]="t.videoSrc" controls playsinline></video>
                  </div>
                </div>

                <div class="col-12 col-lg-6">
                  <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                      <div class="d-flex align-items-start gap-3">
                        <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                             style="width:44px;height:44px;">
                          <i class="bi bi-chat-quote"></i>
                        </div>
                        <div>
                          <div class="fw-semibold">{{ t.name }}</div>
                          <div class="text-muted small">{{ t.title }}</div>
                        </div>
                      </div>

                      <hr />

                      <p class="fs-5 mb-0">“{{ t.quote }}”</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Controls -->
          <button class="carousel-control-prev" type="button" data-bs-target="#videoCarousel" data-bs-slide="next">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target="#videoCarousel" data-bs-slide="prev">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <!-- Indicators -->
          <div class="carousel-indicators">
            <button type="button" *ngFor="let _ of testimonials(); let i = index"
                    data-bs-target="#videoCarousel"
                    [attr.data-bs-slide-to]="i"
                    [class.active]="i===0"
                    [attr.aria-label]="'Slide ' + (i+1)">
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features placeholder -->
  <section id="features" class="container py-5">
    <h2 class="h3 fw-bold mb-3">Features</h2>
    <div class="row g-3">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="fw-semibold mb-1">Responsive Layout</div>
            <div class="text-muted">Mobile, tablet, portrait/landscape, desktop.</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="fw-semibold mb-1">Profile Dropdown</div>
            <div class="text-muted">Shows user email and logout.</div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="fw-semibold mb-1">RTL Video Carousel</div>
            <div class="text-muted">Testimonials that slide right-to-left.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="py-4 bg-dark text-white-50">
    <div class="container small d-flex justify-content-between flex-wrap gap-2">
      <span>© {{ year }} YourApp</span>
      <span>Built with Angular + Bootstrap</span>
    </div>
  </footer>
  `,
  styles: [`
    /* RTL carousel effect: reverse the slide direction */
    .rtl-carousel { direction: rtl; }
    .rtl-carousel .carousel-inner { direction: rtl; }

    /* Ensure controls remain on correct sides visually */
    .rtl-carousel .carousel-control-prev { left: auto; right: 0; }
    .rtl-carousel .carousel-control-next { right: auto; left: 0; }

    /* Video should cover nicely within ratio */
    video { width: 100%; height: 100%; object-fit: cover; }
  `],
})
export class LandingComponent {
  year = new Date().getFullYear();
  email = signal('');

  testimonials = signal<Testimonial[]>([
    {
      name: 'Jordan Lee',
      title: 'Operations Lead',
      quote: 'Clean UI, fast workflow, and the layout looks great on mobile.',
      videoSrc: 'assets/testimonials/t1.mp4',
    },
    {
      name: 'Sam Patel',
      title: 'Project Manager',
      quote: 'The carousel + navigation feels polished and professional.',
      videoSrc: 'assets/testimonials/t2.mp4',
    },
    {
      name: 'Ava Nguyen',
      title: 'Analyst',
      quote: 'Simple login flow and a dashboard that’s easy to navigate.',
      videoSrc: 'assets/testimonials/t3.mp4',
    },
  ]);

  constructor(private auth: AuthService, private router: Router) {
    this.email.set(this.auth.getEmail());
  }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}

