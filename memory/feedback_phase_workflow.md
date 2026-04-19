---
name: Çalışma Prensibi — Phase Geliştirme Akışı
description: Her UI phase'i için branch yönetimi ve push öncesi onay akışı
type: feedback
---

Her phase geliştirmesinde şu akışı takip et:

1. Ana branch (`feat/new-design`) pull et — güncel tut
2. Ana branch'ten yeni bir phase branch'i aç (örn. `feat/ui-phase-1`)
3. Phase'i o branch'te geliştir
4. Push etmeden önce kullanıcıya sor ve onay al

**Why:** Kullanıcı her phase'i review etmek istiyor, onaysız push istenmiyor.
**How to apply:** Her phase tamamlandığında "push edeyim mi?" diye sor, direkt push etme.
