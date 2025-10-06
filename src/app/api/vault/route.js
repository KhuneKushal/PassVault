import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authenticateUser } from '@/lib/auth';
import Vault from '@/models/Vault';

// Get all vault items for user
export async function GET(request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const vaultItems = await Vault.find({ userId });
    
    return NextResponse.json(vaultItems);
  } catch (error) {
    console.error('Vault GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new vault item
export async function POST(request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { encryptedData } = await request.json();

    const vaultItem = new Vault({
      userId,
      encryptedData
    });

    await vaultItem.save();
    return NextResponse.json(vaultItem, { status: 201 });
  } catch (error) {
    console.error('Vault POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update vault item
export async function PUT(request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id, encryptedData } = await request.json();

    const vaultItem = await Vault.findOne({ _id: id, userId });
    if (!vaultItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    vaultItem.encryptedData = encryptedData;
    await vaultItem.save();

    return NextResponse.json(vaultItem);
  } catch (error) {
    console.error('Vault PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete vault item
export async function DELETE(request) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();
    const result = await Vault.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Vault DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}