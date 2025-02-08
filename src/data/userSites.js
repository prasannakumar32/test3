const userSites = [
  {
    id: 'allocation',
    name: 'Resource Allocation',
    path: '/allocation',
    content: {
      title: 'Resource Allocation',
      sections: [
        {
          id: 'production',
          title: 'Production Allocations',
          columns: ['Month', 'Site', 'Quantity', 'Category', 'Status', 'Actions']
        },
        {
          id: 'consumption',
          title: 'Consumption Allocations',
          columns: ['Month', 'Site', 'Quantity', 'Category', 'Status', 'Actions']
        }
      ],
      calculateButton: {
        text: 'CALCULATE ALLOCATION',
        action: 'calculateAllocation'
      }
    }
  }
];

export default userSites;
