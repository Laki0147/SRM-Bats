import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold text-primary mb-4">SRM BATS</h3>
            <p className="text-sm text-muted-foreground">
              Premium cricket equipment and professional coaching services.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/bats" className="text-muted-foreground hover:text-primary">Cricket Bats</Link></li>
              <li><Link href="/products/gear" className="text-muted-foreground hover:text-primary">Protective Gear</Link></li>
              <li><Link href="/products/accessories" className="text-muted-foreground hover:text-primary">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Coaching</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/coaching/programs" className="text-muted-foreground hover:text-primary">Programs</Link></li>
              <li><Link href="/coaching/trainers" className="text-muted-foreground hover:text-primary">Our Trainers</Link></li>
              <li><Link href="/coaching/schedule" className="text-muted-foreground hover:text-primary">Schedule</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SRM Bats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
