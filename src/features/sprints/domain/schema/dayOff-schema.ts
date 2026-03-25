import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) 
export class DayOff {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  date: string;
}

export const DayOffSchema = SchemaFactory.createForClass(DayOff);