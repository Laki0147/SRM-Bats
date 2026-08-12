'use client';

import { motion } from 'framer-motion';
import { ScrollAnimationWrapper } from './ScrollAnimationWrapper';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-32 lg:py-40 bg-[#2A2825] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B7355] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B8956A] rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-8 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Main CTA */}
          <ScrollAnimationWrapper>
            <div className="space-y-8">
              <p className="text-[15px] uppercase tracking-[0.1em] text-[#B8956A] font-medium">
                Start Your Journey
              </p>

              <h2 className="font-crimson text-[48px] lg:text-[56px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                Find Your Perfect Cricket Bat
              </h2>

              <p className="text-[18px] lg:text-[20px] leading-[1.7] text-[#E8E3DB]">
                Whether you're a seasoned professional or just beginning your
                cricket journey, our master craftsmen are here to guide you to
                the perfect bat.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8B7355] text-white text-[16px] font-medium rounded-lg"
                  style={{
                    boxShadow: '0 12px 32px rgba(139, 115, 85, 0.4)',
                  }}
                >
                  <span>Browse Collection</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white text-[16px] font-medium rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span>Book Consultation</span>
                </motion.button>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Right: Contact Cards */}
          <ScrollAnimationWrapper delay={0.2}>
            <div className="space-y-6">
              {/* Email Card */}
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-[#8B7355]/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#B8956A]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-crimson text-[22px] font-semibold text-white mb-2">
                      Email Us
                    </h3>
                    <p className="text-[15px] text-[#E8E3DB] mb-3">
                      Get in touch with our team for personalized assistance.
                    </p>
                    <a
                      href="mailto:info@srmbats.com"
                      className="text-[#B8956A] hover:text-[#8B7355] transition-colors text-[15px] font-medium"
                    >
                      info@srmbats.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-[#8B7355]/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#B8956A]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-crimson text-[22px] font-semibold text-white mb-2">
                      Call Us
                    </h3>
                    <p className="text-[15px] text-[#E8E3DB] mb-3">
                      Speak directly with our master craftsmen.
                    </p>
                    <a
                      href="tel:+441234567890"
                      className="text-[#B8956A] hover:text-[#8B7355] transition-colors text-[15px] font-medium"
                    >
                      +44 (0) 1234 567 890
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Workshop Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="pt-6 border-t border-white/10"
              >
                <p className="text-[13px] uppercase tracking-wider text-[#B8956A] mb-3">
                  Workshop Hours
                </p>
                <div className="space-y-2 text-[15px] text-[#E8E3DB]">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white">Closed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollAnimationWrapper>
        </div>

        {/* Bottom Decorative Line */}
        <ScrollAnimationWrapper delay={0.4} className="mt-20 pt-12 border-t border-white/10">
          <div className="text-center">
            <p className="font-crimson text-[18px] italic text-[#E8E3DB]">
              “Each piece is a study in balance, precision, and material
              honesty.”
            </p>
            <p className="text-[14px] text-[#B8956A] mt-3">
              — Master Craftsman, J. Harrison
            </p>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
