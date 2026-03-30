export class Ticket {
  constructor(
    public readonly id: string,
    public  _ticketNumber: string,
    public  _status: string,
    public  _ticketTitle: string,
    public  _descriptionLink: string,
    public  _estimationTesting: number,
    public  _developmentEstimation: number,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get ticketNumber(): string {
    return this._ticketNumber;
  }

  get status(): string {
    return this._status;
  }

  get ticketTitle(): string {
    return this._ticketTitle;
  }

  get descriptionLink(): string {
    return this._descriptionLink;
  }

  get estimationTesting(): number {
    return this._estimationTesting;
  }
  get developmentEstimation(): number {
    return this._developmentEstimation;
  }
 
  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }


  updateTicketTitle(ticketTitle: string): void {
    this._ticketTitle = ticketTitle;
  }
  updateDescriptionLink(descriptionLink: string): void {
    this._descriptionLink = descriptionLink;
  }
  updateStatus(status: string): void {
    this._status = status;
  }

  updateEstimationTesting(estimationTesting: number): void {
    this._estimationTesting = estimationTesting;
  }
  updateDevelopmentEstimation(developmentEstimation: number): void {
    this._developmentEstimation = developmentEstimation;
  }
  
 
}
