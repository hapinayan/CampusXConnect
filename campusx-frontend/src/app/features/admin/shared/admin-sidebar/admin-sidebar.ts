import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { filter } from 'rxjs';


@Component({
  selector: 'app-admin-sidebar',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar implements AfterViewInit {


  // =====================================================
  // SIDEBAR NAV REFERENCE
  // =====================================================

  @ViewChild('sidebarNav')
  sidebarNav!: ElementRef<HTMLElement>;


  // =====================================================
  // ADMIN MENU ITEMS
  // =====================================================

  menuItems = [

    {
      label: 'Lab Management',
      icon: '🧪',
      route: '/admin/labs'
    },

    {
      label: 'Event Management',
      icon: '📅',
      route: '/admin/events'
    },

    {
      label: 'Complaint Management',
      icon: '📋',
      route: '/admin/complaints'
    },

    {
      label: 'Certificate Management',
      icon: '📄',
      route: '/admin/certificates'
    },

    {
      label: 'Notification Management',
      icon: '🔔',
      route: '/admin/notifications'
    }

  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router
  ) {

    // When route changes,
    // automatically bring active menu into view.

    this.router.events
      .pipe(

        filter(
          event =>
            event instanceof NavigationEnd
        )

      )
      .subscribe(() => {

        setTimeout(() => {

          this.scrollActiveItemIntoView();

        }, 50);

      });

  }


  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  ngAfterViewInit(): void {

    // When page is directly refreshed,
    // show current active menu automatically.

    setTimeout(() => {

      this.scrollActiveItemIntoView();

    }, 100);

  }


  // =====================================================
  // SCROLL ACTIVE MENU INTO VIEW
  // =====================================================

  private scrollActiveItemIntoView(): void {

    if (!this.sidebarNav) {

      return;

    }


    const activeItem =
      this.sidebarNav.nativeElement.querySelector(
        '.nav-item.active'
      ) as HTMLElement | null;


    if (!activeItem) {

      return;

    }


    activeItem.scrollIntoView({

      behavior: 'smooth',

      block: 'nearest',

      inline: 'center'

    });

  }

}