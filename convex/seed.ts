import { mutation } from "./_generated/server";

export const seedAttorneys = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingAttorneys = await ctx.db.query("attorneys").collect();
    if (existingAttorneys.length > 0) {
      return { message: "Data already seeded" };
    }

    const now = Date.now();

    const attorneys = [
      {
        fullName: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        barAssociationId: "BAR123456",
        bio: "Experienced family law attorney with over 10 years of practice. Specializes in divorce, custody, and adoption cases.",
        education: "Harvard Law School, J.D. 2013",
        yearsOfExperience: 10,
        practiceAreas: ["Family Law", "Civil Rights"],
        hourlyRate: 350,
        location: {
          city: "Sofia",
          state: "Sofia City",
          country: "Bulgaria",
          address: "123 Vitosha Boulevard",
        },
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "Michael Chen",
        email: "michael.chen@example.com",
        barAssociationId: "BAR789012",
        bio: "Corporate attorney focusing on mergers and acquisitions, contract negotiations, and business formations.",
        education: "Stanford Law School, J.D. 2015",
        yearsOfExperience: 8,
        practiceAreas: ["Corporate Law", "Contract Law"],
        hourlyRate: 450,
        location: {
          city: "Plovdiv",
          state: "Plovdiv",
          country: "Bulgaria",
          address: "45 Kapana Street",
        },
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "Emily Rodriguez",
        email: "emily.rodriguez@example.com",
        barAssociationId: "BAR345678",
        bio: "Immigration attorney helping families and businesses navigate complex immigration processes.",
        education: "UCLA School of Law, J.D. 2016",
        yearsOfExperience: 7,
        practiceAreas: ["Immigration Law", "Employment Law"],
        hourlyRate: 300,
        fixedFeePackages: [
          {
            name: "Green Card Application",
            description: "Complete green card application process",
            price: 2500,
          },
          {
            name: "Citizenship Application",
            description: "Naturalization process assistance",
            price: 1500,
          },
        ],
        location: {
          city: "Varna",
          state: "Varna",
          country: "Bulgaria",
          address: "78 Primorski Boulevard",
        },
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "David Thompson",
        email: "david.thompson@example.com",
        barAssociationId: "BAR901234",
        bio: "Criminal defense attorney with extensive trial experience. Dedicated to protecting client rights.",
        education: "Georgetown University Law Center, J.D. 2010",
        yearsOfExperience: 13,
        practiceAreas: ["Criminal Law", "Civil Rights"],
        hourlyRate: 400,
        location: {
          city: "Burgas",
          state: "Burgas",
          country: "Bulgaria",
          address: "56 Aleksandrovska Street",
        },
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        fullName: "Lisa Park",
        email: "lisa.park@example.com",
        barAssociationId: "BAR567890",
        bio: "Personal injury attorney fighting for fair compensation for accident victims and their families.",
        education: "University of Chicago Law School, J.D. 2014",
        yearsOfExperience: 9,
        practiceAreas: ["Personal Injury", "Medical Malpractice"],
        hourlyRate: 325,
        location: {
          city: "Stara Zagora",
          state: "Stara Zagora",
          country: "Bulgaria",
          address: "32 Tsar Simeon Street",
        },
        isVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const attorneyIds = [];
    for (const attorney of attorneys) {
      const id = await ctx.db.insert("attorneys", attorney);
      attorneyIds.push(id);
    }

    // Create availability profiles for each attorney
    for (const attorneyId of attorneyIds) {
      await ctx.db.insert("attorneyAvailability", {
        attorneyId,
        timeZone: "Europe/Sofia",
        workingHours: {
          monday: { 
            start: "09:00", 
            end: "17:00",
            breaks: [{ start: "12:00", end: "13:00" }]
          },
          tuesday: { 
            start: "09:00", 
            end: "17:00",
            breaks: [{ start: "12:00", end: "13:00" }]
          },
          wednesday: { 
            start: "09:00", 
            end: "17:00",
            breaks: [{ start: "12:00", end: "13:00" }]
          },
          thursday: { 
            start: "09:00", 
            end: "17:00",
            breaks: [{ start: "12:00", end: "13:00" }]
          },
          friday: { 
            start: "09:00", 
            end: "17:00",
            breaks: [{ start: "12:00", end: "13:00" }]
          },
        },
        consultationSettings: {
          defaultDuration: 60,
          bufferTime: 15,
          maxConsultationsPerDay: 8,
          allowBackToBack: false,
          minAdvanceBooking: 2, // 2 hours minimum advance booking
          maxAdvanceBooking: 30, // 30 days max advance booking
          consultationTypes: [
            { type: "video", duration: 60, price: 200, isEnabled: true },
            { type: "phone", duration: 30, price: 150, isEnabled: true },
            { type: "in-person", duration: 90, price: 300, isEnabled: true },
          ],
        },
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { message: `Seeded ${attorneys.length} attorneys with availability profiles` };
  },
});

export const seedConsultations = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if consultations already exist
    const existingConsultations = await ctx.db.query("consultations").collect();
    if (existingConsultations.length > 0) {
      return { message: "Consultations already seeded" };
    }

    // Get the first attorney
    const attorney = await ctx.db.query("attorneys").first();
    if (!attorney) {
      return { message: "No attorneys found. Seed attorneys first." };
    }

    // Create some test clients
    const client1Id = await ctx.db.insert("clients", {
      fullName: "Test Client 1",
      email: "client1@example.com",
      phone: "+359 888 123 456",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const client2Id = await ctx.db.insert("clients", {
      fullName: "Test Client 2",
      email: "client2@example.com",
      phone: "+359 888 654 321",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create some test consultations for today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const consultations = [
      // Today's bookings
      {
        attorneyId: attorney._id,
        clientId: client1Id,
        scheduledAt: new Date(today).setHours(10, 0, 0, 0), // 10 AM today
        duration: 60,
        price: attorney.hourlyRate,
        status: "confirmed" as const,
        notes: "Test consultation 1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        attorneyId: attorney._id,
        clientId: client2Id,
        scheduledAt: new Date(today).setHours(14, 0, 0, 0), // 2 PM today
        duration: 60,
        price: attorney.hourlyRate,
        status: "pending" as const,
        notes: "Test consultation 2",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      // Tomorrow's bookings
      {
        attorneyId: attorney._id,
        clientId: client1Id,
        scheduledAt: new Date(tomorrow).setHours(11, 0, 0, 0), // 11 AM tomorrow
        duration: 60,
        price: attorney.hourlyRate,
        status: "confirmed" as const,
        notes: "Test consultation 3",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    for (const consultation of consultations) {
      await ctx.db.insert("consultations", consultation);
    }

    return { message: `Seeded ${consultations.length} consultations` };
  },
});
