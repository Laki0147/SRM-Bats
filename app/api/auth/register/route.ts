import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = registerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // TODO: Implement user creation in database
    // 1. Check if user already exists
    // const existingUser = await db.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'User already exists' },
    //     { status: 400 }
    //   );
    // }

    // 2. Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    // const user = await db.user.create({
    //    {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // });

    // For now, return success (replace with actual implementation)
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { name, email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
